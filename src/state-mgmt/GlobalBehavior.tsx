import React, { PropsWithChildren, useEffect, useContext, memo, MutableRefObject, useMemo, useCallback } from 'react';
import { GestureResponderEvent, View } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import moment from 'moment';

import { ENV, ForterActionType, ROUTES, ROUTES_IGNORED_BY_TRACKER, ROUTES_PARAMS, pushNotificationTypes, TealiumEventType } from '_constants';
import { IAppsflyerDeepLinkData, IDeepLinkStoredSid } from '_services/AppsFlyerService';
import { LogMethod } from '_services/Logger';
import { createUUID } from '_utils/create-uuid';
import getInitialActionNavigation from '_utils/getInitialActionNavigation';
import { getDateDurationAsMinutes } from '_utils/getDateDurationAsMinutes';
import { getLogArgs } from '_utils/getLogArgs';
import { useTestingHelper } from '_utils/useTestingHelper';
import { getPageNameByRoute } from '_utils/trackingUtils';
import { useBackground } from '_utils/useBackground';
import { useForeground } from '_utils/useForeground';
import { usePrevious } from '_utils/usePrevious';
import { useLogout } from './auth/hooks';
import { actions as coreActions } from './core/actions';
import { useCheckForUpdates, useEventTracker, useExperimentsRemoteConfig, useExpirePointsBannerDataSet, useRegisterDeviceInfo } from './core/hooks';
import { useActivityAfterBuyGC, useGetCurrentGame } from './game/hooks';
import { GlobalContext } from './GlobalState';

export interface Props {
  navigationRef: MutableRefObject<NavigationContainerRef>;
}

export const GlobalBehavior = memo(({ children, navigationRef }: PropsWithChildren<Props>) => {
  const { deps, dispatch, state } = useContext(GlobalContext);
  const { getTestIdProps } = useTestingHelper('global-behavior');
  const [fetchCurrentGame] = useGetCurrentGame();
  const [getActivityAfterBuyGC] = useActivityAfterBuyGC();
  const registerDeviceInfo = useRegisterDeviceInfo();
  const { trackSystemEvent, trackUserEvent, trackView } = useEventTracker();
  const onCheckForUpdates = useCheckForUpdates();
  const { getExpirePointsBannerDataSet } = useExpirePointsBannerDataSet();
  const [logout] = useLogout();
  const fetchExperimentsConfig = useExperimentsRemoteConfig();

  const listener = navigationRef?.current?.addListener;
  const prevRouterListenerExistence = usePrevious(!!listener);
  useEffect(() => {
    if (!prevRouterListenerExistence && listener) {
      listener('state', () => {
        // keep a navigation history
        const { params: currentRouteParams, name: currentRouteName } = navigationRef?.current?.getCurrentRoute();
        dispatch(coreActions.pushIntoRouteHistory(currentRouteName));

        // when coming back from gift card checkout: refresh available points (user might have made a purchase)
        const lastRouteName = deps.stateSnapshot.get().core.lastRouteKey;
        if (lastRouteName === ROUTES.GIFT_CARD_CHECKOUT) {
          getActivityAfterBuyGC();
        }
        dispatch(coreActions.setLastRouteKey(currentRouteName));
        dispatch(coreActions.setLastRouteParams(currentRouteParams));

        // rZero will decide if the GC purchase can be done, flush events
        if (currentRouteName === ROUTES.GIFT_CARD_CHECKOUT) deps.eventTrackerService.rZero.flush();

        // everything else is tracking-related, check if the route is relevant
        if (ROUTES_IGNORED_BY_TRACKER.includes(currentRouteName)) return;
        if (lastRouteName !== currentRouteName) {
          trackView(currentRouteName as any);
          deps.eventTrackerService.rZero.trackView(getPageNameByRoute(lastRouteName), false);
          deps.eventTrackerService.rZero.trackView(getPageNameByRoute(currentRouteName), true);
        }
      });
    }
  }, [
    prevRouterListenerExistence,
    navigationRef,
    deps.eventTrackerService,
    dispatch,
    trackView,
    listener,
    deps.stateSnapshot,
    fetchCurrentGame,
    getActivityAfterBuyGC
  ]);

  useForeground(async () => {
    if (!deps.apiService.isTokenSetCurrentlyReady()) return;
    setTimeout(async () => {
      trackSystemEvent(TealiumEventType.BACK_TO_FOREGROUND, { user_type: await deps.nativeHelperService.getRuntimeEnv() }, ForterActionType.APP_ACTIVE, {
        action: 'foreground'
      });
    }, ENV.TRACK_EVENT_DELAY_MS);
    const userId = deps.stateSnapshot.get().user.currentUser.sywUserId;
    const deviceId = await deps.nativeHelperService.storage.get<string>(ENV.STORAGE_KEY.DEVICE_ID);
    await deps.crashlyticsService.initialize(userId, { deviceId });
    fetchCurrentGame(true);
    registerDeviceInfo();
    onCheckForUpdates();

    const recordSid = await deps.nativeHelperService.storage.get<IDeepLinkStoredSid>(ENV.STORAGE_KEY.SID);
    if (recordSid?.inactiveDate) {
      const inactiveDuration = getDateDurationAsMinutes(recordSid.inactiveDate);
      if (inactiveDuration > ENV.INACTIVE_DURATION_LIMIT_TIME) {
        await deps.nativeHelperService.storage.remove(ENV.STORAGE_KEY.SID);
      } else {
        await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.SID, { ...recordSid, inactiveDate: null });
      }
    }

    if (state.core.showForcedUpdateScreen) {
      navigationRef.current.navigate(ROUTES.FORCED_UPDATE_MODAL);
    }
  });

  useBackground(async () => {
    const recordSid = await deps.nativeHelperService.storage.get<IDeepLinkStoredSid>(ENV.STORAGE_KEY.SID);
    if (recordSid?.sid) deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.SID, { ...recordSid, inactiveDate: moment() });
    trackSystemEvent(TealiumEventType.BACKGROUND, {}, ForterActionType.APP_PAUSE, { action: 'background' });
  });

  useEffect(() => {
    // detecting network changes
    deps.nativeHelperService.netInfo.subscribeToConnectionChanges(isConnected => dispatch(coreActions.setIsConnected(isConnected)));

    // automatic error context before error reporting
    const errorLogger = (event: { method: LogMethod; argList: any[] }) => {
      deps.crashlyticsService.log(event.method, JSON.stringify(event.argList));
    };
    deps.logger.addEventListener(LogMethod.DEBUG, errorLogger);
    deps.logger.addEventListener(LogMethod.INFO, errorLogger);

    // automatic error reporting
    const reportErrorHandler =
      (_: LogMethod) =>
      ({ argList }: { argList: any[] }) => {
        const { error, metadata } = getLogArgs(argList);
        trackSystemEvent(TealiumEventType.ERROR, { error: error.message }, null);
        deps.crashlyticsService.recordError(error, metadata);
      };
    deps.logger.addEventListener(LogMethod.ERROR, reportErrorHandler(LogMethod.ERROR));
    deps.logger.addEventListener(LogMethod.WARN, reportErrorHandler(LogMethod.WARN));

    // re-registering device info when token changes
    deps.nativeHelperService.deviceInfo.onFCMTokenRefresh(() => deps.apiService.isTokenSetCurrentlyReady() && registerDeviceInfo());

    // refreshing data
    onCheckForUpdates();
    getExpirePointsBannerDataSet();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    deps.eventTrackerService.appsFlyerSDK.clearDeepLinkEventListener();
    // checking for deep links
    const globalBehaviorDeepLinkHandler = async (linkData: IAppsflyerDeepLinkData) => {
      deps.logger.debug('Deep link handler fired', { linkData });
      const link = linkData?.data?.deep_link_value;
      const sid = linkData?.data?.sid;

      if (sid) deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.SID, { inactiveDate: null, sid });

      if (link) {
        dispatch(coreActions.setMarketingId(JSON.stringify(linkData.data)));
        const formattedDeepLinkValue: string = link.replace(ENV.SCHEME, '');
        let deepLinkParams = {};
        for (const [deepLinkRoute, paramList] of Object.entries(ROUTES_PARAMS)) {
          if (formattedDeepLinkValue.startsWith(deepLinkRoute)) {
            deepLinkParams = paramList.reduce((params, item) => ({ ...params, [item]: linkData.data[item] }), {});
          }
        }
        deps.logger.debug('Deep link detected.', { formattedDeepLinkValue, deepLinkParams });
        dispatch(coreActions.setDeepLink(formattedDeepLinkValue, deepLinkParams));
        if (state.core.isAppReady) {
          const { action } = getInitialActionNavigation(!!state.user.currentUser.sywUserId, state.core.hasSeenOnboarding, state.core.showForcedUpdateScreen, {
            deepLink: { route: formattedDeepLinkValue, params: deepLinkParams }
          });
          navigationRef.current.dispatch(action);
        }
      }
    };
    deps.logger.debug('Adding AppsFlyer deep link handler');
    deps.eventTrackerService.appsFlyerSDK.addDeepLinkEventListener(globalBehaviorDeepLinkHandler);
    dispatch(coreActions.setIsDeepLinkListenerReady(true));
  }, [
    deps.eventTrackerService.appsFlyerSDK,
    deps.logger,
    deps.nativeHelperService.storage,
    dispatch,
    navigationRef,
    state.core.hasSeenOnboarding,
    state.core.isAppReady,
    state.core.showForcedUpdateScreen,
    state.user.currentUser.sywUserId
  ]);

  useEffect(() => {
    if (!state?.core.roToken) {
      const roToken = createUUID();
      deps.eventTrackerService.rZero.setUser(roToken);
      dispatch(coreActions.setRzeroToken(roToken));
    }
  }, [state?.core.roToken, dispatch, deps.eventTrackerService]);

  useEffect(() => {
    if (deps.apiService.isTokenInvalid) {
      logout();
    }
  }, [logout, deps.apiService.isTokenInvalid]);

  const handlePushNotificationType = useCallback(
    async pushNotificationType => {
      switch (pushNotificationType) {
        case pushNotificationTypes.USER_INACTIVE:
        case pushNotificationTypes.MARKETING:
        case pushNotificationTypes.USER_BIRTHDAY:
          navigationRef.current.navigate(ROUTES.MAIN);
          break;
        case pushNotificationTypes.MISSION_COMPLETE:
        case pushNotificationTypes.BALANCE_NEW_POINTS:
          navigationRef.current.navigate(ROUTES.POINT_HISTORY);
          break;
        case pushNotificationTypes.BALANCE_EXPIRING_POINTS:
        case pushNotificationTypes.BALANCE_UNUSED_POINTS:
          navigationRef.current.navigate(ROUTES.MAIN, {
            screen: ROUTES.MAIN_TAB.MAIN,
            params: {
              screen: ROUTES.MAIN_TAB.REWARDS
            }
          });
          break;
      }
    },
    [navigationRef]
  );

  useEffect(() => {
    return deps.nativeHelperService.sailthru.onNotificationTapped(pushNotification => handlePushNotificationType(pushNotification?.eventType));
  });

  /* istanbul ignore next */
  useEffect(() => {
    if (!state.core.isAppReady) return;
    async function getInitialNotification() {
      const pushNotification = await deps.nativeHelperService.sailthru.getInitialNotification();
      if (pushNotification) {
        handlePushNotificationType(pushNotification?.eventType);
      }
    }
    getInitialNotification();
  }, [deps.nativeHelperService.sailthru, handlePushNotificationType, state.core.isAppReady]);

  useEffect(() => {
    fetchExperimentsConfig();
  }, [fetchExperimentsConfig]);

  const wrapperStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const onWrapperPress = useCallback(
    (event: GestureResponderEvent) =>
      trackUserEvent(null, {}, ForterActionType.TAP, {
        x: event?.nativeEvent?.pageX,
        y: event?.nativeEvent?.pageY
      }),
    [trackUserEvent]
  );

  if (deps.apiService.isTokenInvalid) return null;

  return (
    <View onTouchStart={onWrapperPress} style={wrapperStyle} {...getTestIdProps('container')}>
      {children}
    </View>
  );
});

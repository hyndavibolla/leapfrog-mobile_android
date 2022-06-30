import React, { useContext, useCallback, useMemo, useEffect, useState } from 'react';
import moment from 'moment';

import { GlobalContext } from '../../GlobalState';
import { Props as ToastProps, ToastType } from '../../../views/shared/Toast';
import { createUUID } from '../../../utils/create-uuid';
import { actions } from '../actions';
import { ENV } from '../../../constants';
import { UserActivityId, UserActivityType } from '../../../services/ApiService';
import { ICCPASetting, IExpirePointsBannerDataSet, IOnboarding, TooltipKey } from '../../../models/general';
import { useAsyncCallback } from '../../../utils/useAsyncCallback';
import { ModalSize } from '../../../views/shared/Modal';
import { NotificationModal } from '../../../views/NotificationModal';
import { getNextPointsToExpire } from '../../../utils/getNextPointsToExpire';
import { useToggleUserTracking } from '_state_mgmt/user/hooks';
import { safeParse } from '_utils/safeParse';

export const useListenToAppState = () => {
  const { deps } = useContext(GlobalContext);
  const [appState, setAppState] = useState(deps.nativeHelperService.appState.currentState);
  useEffect(() => {
    const subscription = deps.nativeHelperService.appState.addEventListener('change', setAppState);
    return () => {
      subscription.remove();
    };
  }, [deps.nativeHelperService.appState, deps.logger]);
  return appState;
};

export const useToast = () => {
  const { dispatch, deps } = useContext(GlobalContext);
  const showToast = useCallback(
    (props: ToastProps): string => {
      const key = createUUID();
      deps.logger.debug('showToast', { key });
      dispatch(actions.addToast(key, props));
      return key;
    },
    [dispatch, deps.logger]
  );
  return useMemo(() => ({ showToast }), [showToast]);
};

export const useErrorToast = (error: any, description?: string, title: string = 'Error') => {
  const { deps } = useContext(GlobalContext);
  const { showToast } = useToast();
  useEffect(() => {
    if (error) {
      deps.logger.info(`Showing error toast for error: ${title}`, description);
      showToast({ type: ToastType.ERROR, title, children: description });
    }
  }, [showToast, error, title, description, deps.logger]);
};

export const useErrorLog = (error: any, description?: string) => {
  const { deps } = useContext(GlobalContext);
  useEffect(() => {
    if (error) deps.logger.error(error, description);
  }, [error, description, deps.logger]);
};

export const useRegisterDeviceInfo = (throwOnRejection?: boolean) => {
  const { deps } = useContext(GlobalContext);
  return useCallback(async () => {
    deps.logger.debug('useRegisterDeviceInfo');
    try {
      const [deviceToken, deviceOsType, fcmToken] = await Promise.all([
        deps.nativeHelperService.deviceInfo.getDeviceTokenAsync(),
        deps.nativeHelperService.deviceInfo.getDeviceOsType(),
        deps.nativeHelperService.deviceInfo.getFCMTokenAsync()
      ]);
      const appVersion = deps.nativeHelperService.deviceInfo.getAppVersion();
      const deviceModel = deps.nativeHelperService.deviceInfo.getDeviceModel();
      const deviceLanguage = deps.nativeHelperService.deviceInfo.getDeviceLanguage();
      const deviceOsVersion = deps.nativeHelperService.deviceInfo.getDeviceOsVersion();
      const timezone = deps.nativeHelperService.deviceInfo.getTimeZone();
      await deps.apiService.registerDeviceInfo(deviceToken, timezone, appVersion, deviceModel, deviceLanguage, deviceOsType, deviceOsVersion, fcmToken);
      deps.eventTrackerService.appsFlyerSDK.updateServerUninstallToken(deps.nativeHelperService.platform.select({ ios: deviceToken, android: fcmToken }));
    } catch (error) {
      deps.logger.error(error, { context: 'Error registering device info' });
      if (throwOnRejection) throw error;
    }
  }, [deps.apiService, deps.nativeHelperService, deps.logger, throwOnRejection, deps.eventTrackerService]);
};

export const useRegisterFusionIntegrationResult = (): [(resultCode: string) => Promise<void>, boolean, any, void] => {
  const { deps, state } = useContext(GlobalContext);
  return useAsyncCallback(async (resultCode: string) => {
    deps.logger.debug('useRegisterFusionIntegrationResult', { resultCode });
    const searsUserId = state.user.currentUser.personal.searsUserId || undefined;
    const sywUserId = state.user.currentUser.sywUserId || undefined;
    const deviceId = deps.nativeHelperService.deviceInfo.getUniqueId();
    const activityId = UserActivityId.SYWM_APPLIED;
    const attributes = { applicationStatus: resultCode, sywUserId, searsUserId };
    await deps.apiService.registerUserActivity([deviceId], UserActivityType.SYWM_CARD, [{ activityId, attributes }]);
  }, []);
};

export const useCCPA = () => {
  const { deps } = useContext(GlobalContext);
  const [toggleUserTracking] = useToggleUserTracking();

  const showBanner = useAsyncCallback(async () => {
    deps.logger.debug('showBanner');
    const setting = await deps.nativeHelperService.storage.get<ICCPASetting>(ENV.STORAGE_KEY.CCPA_SETTING);
    const allow = typeof setting?.allow === 'boolean' ? setting?.allow : await deps.ccpaService.showConsentBanner();
    if (allow !== setting?.allow) {
      deps.logger.debug('Setting CCPA banner to', allow);
      await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.CCPA_SETTING, { allow } as ICCPASetting);
      await toggleUserTracking();
    }
  }, []);

  const resetSetting = useAsyncCallback(async () => {
    deps.logger.debug('resetSetting');
    await deps.nativeHelperService.storage.remove(ENV.STORAGE_KEY.CCPA_SETTING);
  }, []);

  useErrorLog(showBanner[2], 'Error showing ccpa banner');
  useErrorLog(resetSetting[2], 'Error resetting ccpa banner');

  return useMemo(() => ({ showBanner, resetSetting }), [showBanner, resetSetting]);
};

export const useCookies = () => {
  const { deps } = useContext(GlobalContext);

  const clearAll = useAsyncCallback<any, boolean>(async () => {
    deps.logger.debug('useCookies', 'clearAll');
    await deps.nativeHelperService.storage.remove(ENV.STORAGE_KEY.COOKIE_REGISTRY);
    const response = await deps.nativeHelperService.cookieManager.clearAll(true);
    return response;
  }, []);

  const getCookieRegistry = useAsyncCallback<any, Record<string, string>>(async () => {
    const registry = await deps.nativeHelperService.storage.get<Record<string, string>>(ENV.STORAGE_KEY.COOKIE_REGISTRY);
    deps.logger.debug('useCookies', 'getCookieRegistry', { registry });
    return registry || {};
  }, []);

  const setCookieRegistry = useAsyncCallback(async (domain: string, cookie: string) => {
    deps.logger.debug('useCookies', 'setCookieRegistry', { [domain]: cookie });
    const registry = await deps.nativeHelperService.storage.get<Record<string, string>>(ENV.STORAGE_KEY.COOKIE_REGISTRY);
    await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.COOKIE_REGISTRY, { ...registry, [domain]: cookie });
  }, []);

  useErrorLog(clearAll[2], 'Error clearing the cookies... moving on');
  useErrorLog(getCookieRegistry[2], 'Error getting cookie registry');
  useErrorLog(setCookieRegistry[2], 'Error setting cookie registry');
  return useMemo(() => ({ clearAll, getCookieRegistry, setCookieRegistry }), [clearAll, getCookieRegistry, setCookieRegistry]);
};

export const useOnboarding = () => {
  const { deps, dispatch } = useContext(GlobalContext);

  const restoreSeenOnboarding = useAsyncCallback<any, void>(async () => {
    deps.logger.debug('restoreSeenOnboarding');
    const setting = await deps.nativeHelperService.storage.get<IOnboarding>(ENV.STORAGE_KEY.ONBOARDING);
    dispatch(actions.setHasSeenOnboarding(!!setting?.seenOnboarding));
  }, []);

  const setOnboarding = useAsyncCallback(async (seenOnboarding: boolean) => {
    deps.logger.debug('setOnboarding', { seenOnboarding });
    await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.ONBOARDING, { seenOnboarding });
    dispatch(actions.setHasSeenOnboarding(seenOnboarding));
  }, []);

  useErrorLog(restoreSeenOnboarding[2], 'Error restoring onboarding');
  useErrorLog(setOnboarding[2], 'Error setting onboarding');

  return useMemo(() => ({ restoreSeenOnboarding: restoreSeenOnboarding, setOnboarding }), [restoreSeenOnboarding, setOnboarding]);
};

export const useTooltipList = () => {
  const { deps, dispatch } = useContext(GlobalContext);

  const getViewedTooltipList = useAsyncCallback(async () => {
    deps.logger.debug('getViewedTooltipList');
    const list = (await deps.nativeHelperService.storage.get<TooltipKey[]>(ENV.STORAGE_KEY.VIEWED_TOOLTIP_LIST)) || [];
    dispatch(actions.setViewedTooltipList(list));
    return list;
  }, []);

  const [onGetViewedTooltipList] = getViewedTooltipList;
  const setViewedTooltipList = useAsyncCallback(async (key: TooltipKey) => {
    deps.logger.debug('setViewedTooltipList', { key });
    const list = await onGetViewedTooltipList();
    const newList = Array.from(new Set([...list, key]));
    await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.VIEWED_TOOLTIP_LIST, newList);
    dispatch(actions.setViewedTooltipList(newList));
  }, []);

  const getDismissedTooltipList = useAsyncCallback(async () => {
    deps.logger.debug('getDismissedTooltipList');
    const list = (await deps.nativeHelperService.storage.get<TooltipKey[]>(ENV.STORAGE_KEY.DISMISSED_TOOLTIP_LIST)) || [];
    dispatch(actions.setDismissedTooltipList(list));
    return list;
  }, []);

  const [onGetDismissedTooltipList] = getDismissedTooltipList;
  const setDismissedTooltipList = useAsyncCallback(async (key: TooltipKey) => {
    deps.logger.debug('setDismissedTooltipList', { key });
    const list = await onGetDismissedTooltipList();
    const newList = Array.from(new Set([...list, key]));
    await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.DISMISSED_TOOLTIP_LIST, newList);
    dispatch(actions.setDismissedTooltipList(newList));
  }, []);

  useErrorLog(getViewedTooltipList[2], 'Error getting viewed tooltip list');
  useErrorLog(setViewedTooltipList[2], 'Error setting viewed tooltip list');
  useErrorLog(getDismissedTooltipList[2], 'Error getting dismissed tooltip list');
  useErrorLog(setDismissedTooltipList[2], 'Error setting dismissed tooltip list');

  return useMemo(
    () => ({ getViewedTooltipList, setViewedTooltipList, getDismissedTooltipList, setDismissedTooltipList }),
    [getViewedTooltipList, setViewedTooltipList, getDismissedTooltipList, setDismissedTooltipList]
  );
};

export const useMissionModal = () => {
  const { deps, dispatch } = useContext(GlobalContext);

  const restoreMissionModal = useAsyncCallback(async () => {
    deps.logger.debug('restoreHasSeenMissionModal');
    const setting = await deps.nativeHelperService.storage.get<{ hasSeenMissionModal: boolean }>(ENV.STORAGE_KEY.MISSION_AFTER_PURCHASE_MODAL);
    dispatch(actions.setHasSeenMissionModal(!!setting?.hasSeenMissionModal));
  }, []);

  const setMissionModal = useAsyncCallback(async (hasSeenMissionModal: boolean) => {
    deps.logger.debug('setHasSeenMissionModal', { hasSeenMissionModal });
    await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.MISSION_AFTER_PURCHASE_MODAL, { hasSeenMissionModal });
    dispatch(actions.setHasSeenMissionModal(hasSeenMissionModal));
  }, []);

  useErrorLog(restoreMissionModal[2], 'Error restoring mission after purchase modal');
  useErrorLog(setMissionModal[2], 'Error setting mission after purchase modal');

  return useMemo(() => ({ restoreMissionModal, setMissionModal }), [restoreMissionModal, setMissionModal]);
};

export const usePNPrompt = (throwOnRejection?: boolean) => {
  const { deps, dispatch } = useContext(GlobalContext);

  return useAsyncCallback(
    async (isMainRoute?: boolean) => {
      deps.logger.debug('usePNPrompt');

      if (isMainRoute && !(await deps.nativeHelperService.storage.get<boolean>(ENV.STORAGE_KEY.HAS_VISITED_MAIN_SECTION))) {
        return await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.HAS_VISITED_MAIN_SECTION, true);
      }

      const authStatus = await deps.nativeHelperService.messaging.hasPermission();
      const arePNEnabled = [
        deps.nativeHelperService.pushNotificationsAuthStatus.AUTHORIZED,
        deps.nativeHelperService.pushNotificationsAuthStatus.PROVISIONAL,
        true
      ].includes(authStatus);
      const arePNRejected = [deps.nativeHelperService.pushNotificationsAuthStatus.DENIED, false].includes(authStatus);

      if (arePNEnabled) return;

      const lastTimePNPermissionAsked = await deps.nativeHelperService.storage.get<number>(ENV.STORAGE_KEY.LAST_TIME_PN_PERMISSION_ASKED);
      const hasEverAsked = !!lastTimePNPermissionAsked;

      const daysDiff = moment(Date.now()).diff(lastTimePNPermissionAsked, 'days');

      const shouldPrompt = !hasEverAsked || (hasEverAsked && daysDiff >= ENV.PN_DAYS_TO_REQUEST_PERMISSION);
      deps.logger.debug('PN prompt', { authStatus, pushNotificationsEnabled: arePNEnabled, lastTimePNPermissionAsked, daysDiff, hasEverAsked, shouldPrompt });

      if (!shouldPrompt) return;

      await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.LAST_TIME_PN_PERMISSION_ASKED, Date.now());

      const modalKey = 'pn-modal';
      const onCancel = /* istanbul ignore next */ () => dispatch(actions.removeModal(modalKey));
      const onConfirm = /* istanbul ignore next */ async (): Promise<void> => {
        deps.logger.info('PN prompt requesting permission');
        await deps.nativeHelperService.messaging.requestPermission();
        onCancel();
      };
      const children = <NotificationModal onConfirm={onConfirm} onCancel={onCancel} arePNRejected={arePNRejected} />;
      dispatch(actions.addModal(modalKey, { size: ModalSize.FULL_SCREEN, children, showCloseButton: true, onClose: onCancel }));
    },
    [],
    throwOnRejection
  );
};

export const useExpirePointsBannerDataSet = () => {
  const { deps, dispatch } = useContext(GlobalContext);
  const getExpirePointsBannerDataSet = useCallback(async () => {
    deps.logger.debug('useExpirePointsBannerDataSet', 'getter');
    const dataSet = await deps.nativeHelperService.storage.get<IExpirePointsBannerDataSet>(ENV.STORAGE_KEY.EXPIRE_POINTS_BANNER);
    if (!dataSet) return;
    dispatch(actions.setExpirePointsBannerDataSet(dataSet));
    deps.logger.debug('useExpirePointsBannerDataSet', 'retrieved data', dataSet);
  }, [deps.logger, deps.nativeHelperService.storage, dispatch]);

  const setExpirePointsBannerDataSet = useCallback(async () => {
    const points = getNextPointsToExpire(deps.stateSnapshot.get().game.current.balance.memberOwnPointsToExpire);
    const dataSet: IExpirePointsBannerDataSet = { lastAcceptedDate: Date.now(), lastPointsDate: points?.memberOwnExpiryDate };
    dispatch(actions.setExpirePointsBannerDataSet(dataSet));
    await deps.nativeHelperService.storage.set<IExpirePointsBannerDataSet>(ENV.STORAGE_KEY.EXPIRE_POINTS_BANNER, dataSet);
    deps.logger.debug('useExpirePointsBannerDataSet', 'data was set', dataSet);
  }, [deps.logger, deps.stateSnapshot, deps.nativeHelperService.storage, dispatch]);

  return useMemo(() => ({ getExpirePointsBannerDataSet, setExpirePointsBannerDataSet }), [getExpirePointsBannerDataSet, setExpirePointsBannerDataSet]);
};

export const useExperimentsRemoteConfig = () => {
  const { deps, dispatch } = useContext(GlobalContext);
  return useCallback(async () => {
    deps.logger.debug('useExperimentsRemoteConfig');
    let remoteExperimentsConfig = await deps.remoteConfigService.getAll();
    if (!remoteExperimentsConfig) {
      remoteExperimentsConfig = deps.remoteConfigService.getImmediateAll();
    }
    let experiments = {};
    if (remoteExperimentsConfig) {
      for (const [key, value] of Object.entries(remoteExperimentsConfig)) {
        if (Object.values(ENV.EXPERIMENTS).includes(key)) {
          experiments[key] = safeParse(value._value);
        }
      }
    }
    dispatch(actions.setExperimentsConfig(experiments));
  }, [deps.logger, deps.remoteConfigService, dispatch]);
};

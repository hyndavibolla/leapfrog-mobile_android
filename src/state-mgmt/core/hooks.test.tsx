import { waitFor } from '@testing-library/react-native';

import {
  useToast,
  useErrorToast,
  useListenToAppState,
  useRegisterDeviceInfo,
  useEventTracker,
  useRegisterFusionIntegrationResult,
  useCCPA,
  useCookies,
  useOnboarding,
  useTooltipList,
  useCheckForUpdates,
  useMissionModal,
  usePNPrompt,
  useExpirePointsBannerDataSet,
  useExperimentsRemoteConfig
} from './hooks';
import { Props as ToastProps } from '../../views/shared/Toast';
import { actions } from './actions';
import { renderWrappedHook } from '../../test-utils/renderWrappedHook';
import { Deps, ICCPASetting, IExpirePointsBannerDataSet, IGlobalState, TooltipKey } from '../../models/general';
import { getMockDeps } from '../../test-utils/getMockDeps';
import { wait } from '../../utils/wait';
import { UserActivityId, UserActivityType } from '../../services/ApiService';
import { ENV, ForterNavigationType, PageNames, ROUTES, TealiumEventType } from '../../constants';
import { getInitialState } from '../GlobalState';
import { ACTION_TYPE } from './actions';
import { NativeEventSubscription } from 'react-native';
import { noop } from '../../utils/noop';

describe('core hooks', () => {
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
  });

  describe('useToast', () => {
    it('should show a toast', async () => {
      const props: ToastProps = { title: 'hello' };
      const { result, mockReducer } = renderWrappedHook(() => useToast(), undefined, undefined, jest.fn().mockReturnValue(initialState));
      waitFor(() => {
        const key = result.current.showToast(props);
        expect(typeof key).toBe('string');
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.addToast(key, props));
      });
    });
  });

  describe('useErrorToast', () => {
    it('should show an error toast', async () => {
      const { mockReducer } = renderWrappedHook(() => useErrorToast('error here'), undefined, undefined, jest.fn().mockReturnValue(initialState));
      expect(mockReducer).toBeCalledWith(expect.any(Object), actions.addToast(expect.any(String), expect.any(Object)));
    });
  });

  describe('useListenToAppState', () => {
    it('should return the updated app state', async () => {
      deps.nativeHelperService.appState.addEventListener = jest.fn((_, fn): NativeEventSubscription => {
        wait(0).then(() => fn('inactive'));
        return { remove: noop };
      });
      const { result, unmount } = renderWrappedHook(() => useListenToAppState(), deps);
      expect(result.current).toEqual('active');
      expect(deps.nativeHelperService.appState.addEventListener).toBeCalledWith('change', expect.any(Function));
      waitFor(() => {
        expect(result.current).toEqual('inactive');
        unmount();
      });
    });
  });

  describe('useRegisterDeviceInfo', () => {
    it('should register device info', async () => {
      const { result } = renderWrappedHook(() => useRegisterDeviceInfo(), deps);
      await (result.current as any)();
      expect(deps.apiService.registerDeviceInfo).toBeCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String)
      );
      expect(deps.eventTrackerService.appsFlyerSDK.updateServerUninstallToken).toBeCalled();
    });

    it('should catch errors registering device info', async () => {
      deps.apiService.registerDeviceInfo = Promise.reject;
      const { result } = renderWrappedHook(() => useRegisterDeviceInfo(), deps);
      await (result.current as any)();
      expect(deps.logger.error).toBeCalled();
    });
  });

  describe('useEventTracker', () => {
    const testingRoutes = [
      { route: ROUTES.TOOLTIP.MISSIONS_STEP_1, page: PageNames.TOOLTIP.MISSIONS_STEP_1 },
      { route: ROUTES.TOOLTIP.MISSIONS_STEP_2, page: PageNames.TOOLTIP.MISSIONS_STEP_2 },
      { route: ROUTES.TOOLTIP.MISSIONS_STEP_3, page: PageNames.TOOLTIP.MISSIONS_STEP_3 },
      { route: ROUTES.MAIN_TAB.STREAK, page: PageNames.MAIN.MISSIONS }
    ];
    it.each(testingRoutes)('should return the parsed page name by route', async ({ route, page }) => {
      deps.stateSnapshot.get = () => ({ ...initialState, core: { ...initialState.core, lastRouteKey: route } });
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackSystemEvent('event', { eventData: 1 });
      expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith('event', expect.objectContaining({ page_name: page }));
    });

    it('should track system events even do the user is not logged in', async () => {
      deps.stateSnapshot.get = () => initialState;
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackSystemEvent('event', { eventData: 1 });
      expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith('event', expect.objectContaining({ eventData: 1 }));
    });

    it('should track system events even if the user is not enabled to track', async () => {
      deps.stateSnapshot.get = () => initialState;
      deps.eventTrackerService.isTrackingEnabled = jest.fn().mockResolvedValue(false);
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackSystemEvent('event', { eventData: 1 });
      expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith('event', expect.objectContaining({ eventData: 1 }));
    });

    it('should track system events', async () => {
      deps.stateSnapshot.get = () => ({
        ...initialState,
        core: { ...initialState.core, lastRouteKey: ROUTES.LOGIN },
        game: {
          ...initialState.game,
          current: { ...initialState.game.current, memberships: { ...initialState.game.current.memberships, userHasSywCard: true } }
        }
      });
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackSystemEvent('event', { eventData: 1 }, 'forter-event');
      expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith('event', expect.objectContaining({ eventData: 1 }));
      expect(deps.eventTrackerService.forterSDK.fraudTrackAction).toBeCalledWith('forter-event', expect.any(Object));
    });

    it('should track system events using tealium only', async () => {
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackSystemEvent('event', { eventData: 1 }, null);
      expect(deps.eventTrackerService.tealiumSDK.track).toBeCalled();
      expect(deps.eventTrackerService.forterSDK.fraudTrackAction).not.toBeCalled();
    });

    it('should track system events using forter only', async () => {
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackSystemEvent(null, { eventData: 1 }, 'forter-event');
      expect(deps.eventTrackerService.tealiumSDK.track).not.toBeCalled();
      expect(deps.eventTrackerService.forterSDK.fraudTrackAction).toBeCalled();
    });

    it('should track view events', async () => {
      deps.stateSnapshot.get = () => ({
        ...initialState,
        core: { ...initialState.core, lastRouteKey: ROUTES.LOGIN },
        game: {
          ...initialState.game,
          current: { ...initialState.game.current, memberships: { ...initialState.game.current.memberships, userHasSywCard: true } }
        }
      });
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackView('route', { eventData: 1 });
      expect(deps.eventTrackerService.tealiumSDK.trackView).toBeCalledWith('route', expect.objectContaining({ eventData: 1 }));
      expect(deps.eventTrackerService.forterSDK.fraudTrackNavigationEvent).toBeCalledWith('route', ForterNavigationType.APP);
    });

    it('should track view events using the base data for screen view events', async () => {
      deps.stateSnapshot.get = () => ({
        ...initialState,
        core: { ...initialState.core, lastRouteKey: ROUTES.LOGIN },
        game: {
          ...initialState.game,
          current: { ...initialState.game.current, memberships: { ...initialState.game.current.memberships, userHasSywCard: true } }
        }
      });
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackView('route', { eventData: 1 }, true);
      expect(deps.eventTrackerService.tealiumSDK.trackView).toBeCalledWith('route', expect.objectContaining({ eventData: 1 }));
    });

    it('should track user events', async () => {
      deps.stateSnapshot.get = () => ({
        ...initialState,
        core: { ...initialState.core, lastRouteKey: ROUTES.LOGIN },
        game: {
          ...initialState.game,
          current: { ...initialState.game.current, memberships: { ...initialState.game.current.memberships, userHasSywCard: true } }
        }
      });
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackUserEvent('event', { eventData: 1 }, 'forter-event');
      expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith('event', expect.objectContaining({ eventData: 1 }));
      expect(deps.eventTrackerService.forterSDK.fraudTrackAction).toBeCalledWith('forter-event', expect.any(Object));
    });

    it('should track user events using tealium only', async () => {
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackUserEvent('event', { eventData: 1 }, null);
      expect(deps.eventTrackerService.tealiumSDK.track).toBeCalled();
      expect(deps.eventTrackerService.forterSDK.fraudTrackAction).not.toBeCalled();
    });

    it('should track user events using forter only', async () => {
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackUserEvent(null, { eventData: 1 }, 'forter.event');
      expect(deps.eventTrackerService.tealiumSDK.track).not.toBeCalled();
      expect(deps.eventTrackerService.forterSDK.fraudTrackAction).toBeCalled();
    });

    it('should track user events without userId', async () => {
      deps.stateSnapshot.get = () => ({
        ...initialState,
        core: { ...initialState.core, lastRouteKey: ROUTES.LOGIN },
        game: {
          ...initialState.game,
          current: { ...initialState.game.current, memberships: { ...initialState.game.current.memberships, userHasSywCard: true } }
        }
      });
      deps.eventTrackerService.isTrackingEnabled = jest.fn().mockResolvedValue(false);
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackUserEvent('event', { eventData: 1 });
      expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith('event', expect.objectContaining({ eventData: 1 }));
    });

    it('should track user events with marketingId', async () => {
      deps.stateSnapshot.get = () => ({
        ...initialState,
        core: { ...initialState.core, marketingId: 'marketing-id' }
      });
      deps.eventTrackerService.isTrackingEnabled = jest.fn().mockResolvedValue(false);
      const { result } = renderWrappedHook(() => useEventTracker(), deps);
      await result.current.trackSystemEvent(TealiumEventType.ERROR, { eventData: 1 });
      expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith(TealiumEventType.ERROR, expect.objectContaining({ eventData: 1 }));
    });
  });

  describe('useRegisterFusionIntegrationResult', () => {
    it('should register fusion integration info', async () => {
      const resultCode = 'N';
      initialState.user.currentUser = {
        ...initialState.user.currentUser,
        sywUserId: 'sywUserId',
        personal: { ...initialState.user.currentUser.personal, searsUserId: 'searsUserId' }
      };
      const { result } = renderWrappedHook(() => useRegisterFusionIntegrationResult(), deps, initialState);
      await waitFor(async () => {
        await (result.current[0] as (t: string) => Promise<void>)(resultCode);
        expect(deps.logger.debug).toBeCalledWith('useRegisterFusionIntegrationResult', { resultCode });
        expect(deps.apiService.registerUserActivity).toBeCalledWith([expect.any(String)], UserActivityType.SYWM_CARD, [
          { activityId: UserActivityId.SYWM_APPLIED, attributes: { applicationStatus: resultCode, sywUserId: 'sywUserId', searsUserId: 'searsUserId' } }
        ]);
      });
    });

    it('should register fusion integration info without searsUserId', async () => {
      const resultCode = 'N';
      initialState.user.currentUser = {
        ...initialState.user.currentUser,
        sywUserId: 'sywUserId',
        personal: { ...initialState.user.currentUser.personal, searsUserId: undefined }
      };
      const { result } = renderWrappedHook(() => useRegisterFusionIntegrationResult(), deps, initialState);
      await waitFor(async () => {
        await (result.current[0] as (t: string) => Promise<void>)(resultCode);
        expect(deps.logger.debug).toBeCalledWith('useRegisterFusionIntegrationResult', { resultCode });
        expect(deps.apiService.registerUserActivity).toBeCalledWith([expect.any(String)], UserActivityType.SYWM_CARD, [
          { activityId: UserActivityId.SYWM_APPLIED, attributes: { applicationStatus: resultCode, sywUserId: 'sywUserId', searsUserId: undefined } }
        ]);
      });
    });

    it('should register fusion integration info without sywUserId', async () => {
      const resultCode = 'N';
      initialState.user.currentUser = {
        ...initialState.user.currentUser,
        sywUserId: undefined,
        personal: { ...initialState.user.currentUser.personal, searsUserId: 'searsUserId' }
      };
      const { result } = renderWrappedHook(() => useRegisterFusionIntegrationResult(), deps, initialState);
      await waitFor(async () => {
        await (result.current[0] as (t: string) => Promise<void>)(resultCode);
        expect(deps.logger.debug).toBeCalledWith('useRegisterFusionIntegrationResult', { resultCode });
        expect(deps.apiService.registerUserActivity).toBeCalledWith([expect.any(String)], UserActivityType.SYWM_CARD, [
          { activityId: UserActivityId.SYWM_APPLIED, attributes: { applicationStatus: resultCode, sywUserId: undefined, searsUserId: 'searsUserId' } }
        ]);
      });
    });
  });

  describe('useCCPA', () => {
    it('should showBanner when there are no previous settings', async () => {
      const { result } = renderWrappedHook(() => useCCPA(), deps);
      await waitFor(async () => {
        await result.current.showBanner[0]();
        expect(deps.ccpaService.showConsentBanner).toBeCalled();
      });
    });

    it('should NOT showBanner when there are previous settings', async () => {
      deps.nativeHelperService.storage.get = () => ({ allow: true } as ICCPASetting as any);
      const { result } = renderWrappedHook(() => useCCPA(), deps);
      await waitFor(async () => {
        await result.current.showBanner[0]();
        expect(deps.ccpaService.showConsentBanner).not.toBeCalled();
      });
    });

    it('should reset CCPA settings', async () => {
      const { result } = renderWrappedHook(() => useCCPA(), deps);
      await waitFor(async () => {
        await result.current.resetSetting[0]();
        expect(deps.nativeHelperService.storage.remove).toBeCalledWith(ENV.STORAGE_KEY.CCPA_SETTING);
      });
    });
  });

  describe('useCookies', () => {
    beforeEach(() => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ a: 'a' });
    });
    it('should clear all cookies', async () => {
      const { result } = renderWrappedHook(() => useCookies(), deps);
      await waitFor(async () => {
        await result.current.clearAll[0]();
        expect(deps.nativeHelperService.cookieManager.clearAll).toBeCalledWith(true);
      });
    });

    it('should get the cookie registry', async () => {
      const { result } = renderWrappedHook(() => useCookies(), deps);
      await waitFor(async () => {
        await result.current.getCookieRegistry[0]();
        expect(result.current.getCookieRegistry[3]).toEqual({ a: 'a' });
      });
    });

    it('should get the cookie registry fallback', async () => {
      deps.nativeHelperService.storage.get = async () => null;
      const { result } = renderWrappedHook(() => useCookies(), deps);
      await waitFor(async () => {
        await result.current.getCookieRegistry[0]();
        expect(result.current.getCookieRegistry[3]).toEqual({});
      });
    });

    it('should set the cookie registry', async () => {
      const { result } = renderWrappedHook(() => useCookies(), deps);
      await waitFor(async () => {
        await result.current.setCookieRegistry[0]('domain', 'cookie');
        expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.COOKIE_REGISTRY, { a: 'a', domain: 'cookie' });
      });
    });
  });

  describe('useOnboarding', () => {
    it('should get the seen onboarding status', async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ seenOnboarding: false });
      const { result } = renderWrappedHook(() => useOnboarding(), deps);
      await waitFor(async () => {
        await result.current.restoreSeenOnboarding[0]();
        expect(deps.nativeHelperService.storage.get).toBeCalled();
      });
    });
  });

  it('should set the seen onboarding status', async () => {
    const { result } = renderWrappedHook(() => useOnboarding(), deps);
    await waitFor(async () => {
      await result.current.setOnboarding[0](true);
      expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.ONBOARDING, { seenOnboarding: true });
    });
  });

  describe('useTooltipList', () => {
    it('should get the viewed tooltip list when list is not set', async () => {
      const { result } = renderWrappedHook(() => useTooltipList(), deps);
      await waitFor(async () => {
        await result.current.getViewedTooltipList[0]();
        expect(result.current.getViewedTooltipList[3]).toEqual([]);
      });
    });

    it('should get the viewed tooltip list', async () => {
      deps.nativeHelperService.storage.get = async () => [TooltipKey.EARN] as any;
      const { result } = renderWrappedHook(() => useTooltipList(), deps);
      await waitFor(async () => {
        await result.current.getViewedTooltipList[0]();
        expect(result.current.getViewedTooltipList[3]).toEqual([TooltipKey.EARN]);
      });
    });

    it('should set viewed tooltip list', async () => {
      deps.nativeHelperService.storage.get = async () => [TooltipKey.EARN] as any;
      const { result } = renderWrappedHook(() => useTooltipList(), deps);
      await waitFor(async () => {
        await result.current.setViewedTooltipList[0](TooltipKey.REWARDS);
        expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.VIEWED_TOOLTIP_LIST, [TooltipKey.EARN, TooltipKey.REWARDS]);
      });
    });

    it('should get the dismissed tooltip list when list is not set', async () => {
      const { result } = renderWrappedHook(() => useTooltipList(), deps);
      await waitFor(async () => {
        await result.current.getDismissedTooltipList[0]();
        expect(result.current.getDismissedTooltipList[3]).toEqual([]);
      });
    });

    it('should get the dismissed tooltip list', async () => {
      deps.nativeHelperService.storage.get = async () => [TooltipKey.EARN] as any;
      const { result } = renderWrappedHook(() => useTooltipList(), deps);
      await waitFor(async () => {
        await result.current.getDismissedTooltipList[0]();
        expect(result.current.getDismissedTooltipList[3]).toEqual([TooltipKey.EARN]);
      });
    });

    it('should set dismissed tooltip list', async () => {
      deps.nativeHelperService.storage.get = async () => [TooltipKey.EARN] as any;
      const { result } = renderWrappedHook(() => useTooltipList(), deps);
      await waitFor(async () => {
        await result.current.setDismissedTooltipList[0](TooltipKey.REWARDS);
        expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.DISMISSED_TOOLTIP_LIST, [TooltipKey.EARN, TooltipKey.REWARDS]);
      });
    });
  });

  describe('useCheckForUpdates', () => {
    beforeEach(() => {
      deps.nativeHelperService.deviceInfo.getReadableVersion = () => '1';
    });

    it('should show the update modal when cached required version is higher than current', async () => {
      deps.remoteConfigService.getImmediateValue = (() => ({ required: 2, suggested: 0 })) as any;
      const { result, mockReducer } = renderWrappedHook(() => useCheckForUpdates(), deps);
      await waitFor(async () => {
        await result.current();
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setForcedUpdateScreen(true));
      });
    });

    it('should show the update modal when fetched required version is higher than current', async () => {
      deps.remoteConfigService.getImmediateValue = (() => ({ required: 0, suggested: 0 })) as any;
      deps.remoteConfigService.getValue = (async () => ({ required: 2, suggested: 0 })) as any;
      const { result, mockReducer } = renderWrappedHook(() => useCheckForUpdates(), deps);
      await waitFor(async () => {
        await result.current();
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setForcedUpdateScreen(true));
      });
    });

    it('should show the update modal when fetched suggested version is higher than current', async () => {
      deps.remoteConfigService.getImmediateValue = (() => ({ required: 0, suggested: 0 })) as any;
      deps.remoteConfigService.getValue = (async () => ({ required: 0, suggested: 2 })) as any;
      const { result, mockReducer } = renderWrappedHook(() => useCheckForUpdates(), deps);
      await waitFor(async () => {
        await result.current();
        expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.LAST_SUGGESTED_BUILD_VERSION, 2);
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.addModal(expect.any(String), expect.anything()));
      });
    });

    it('should NOT show the update modal when fetched versions are NOT higher than current', async () => {
      deps.remoteConfigService.getImmediateValue = (() => ({ required: 0, suggested: 0 })) as any;
      deps.remoteConfigService.getValue = (async () => ({ required: 2, suggested: 0 })) as any;
      const { result, mockReducer } = renderWrappedHook(() => useCheckForUpdates(), deps);
      await waitFor(async () => {
        await result.current();
        expect(mockReducer).not.toBeCalledWith(expect.any(Object), actions.addModal(expect.any(String), expect.objectContaining({ showCloseButton: true })));
      });
    });

    it('should NOT show the update modal when fetched suggested version is higher than current but was already suggested', async () => {
      deps.remoteConfigService.getImmediateValue = (() => ({ required: 0, suggested: 0 })) as any;
      deps.remoteConfigService.getValue = (async () => ({ required: 0, suggested: 2 })) as any;
      deps.nativeHelperService.storage.get = (async () => 2) as any;
      const { result, mockReducer } = renderWrappedHook(() => useCheckForUpdates(), deps);
      await waitFor(async () => {
        await result.current();
        expect(deps.nativeHelperService.storage.set).not.toBeCalled();
        expect(mockReducer).not.toBeCalledWith(expect.any(Object), actions.addModal(expect.any(String), expect.objectContaining({ showCloseButton: true })));
      });
    });

    it('should NOT fail when process gets rejected', async () => {
      deps.remoteConfigService.getValue = Promise.reject;
      const { result } = renderWrappedHook(() => useCheckForUpdates(), deps);
      await waitFor(async () => {
        await result.current();
        expect(deps.logger.error).toBeCalled();
      });
    });
  });

  describe('useMissionModal', () => {
    it('should get the seen mission modal status', async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ hasSeenMissionModal: false });
      const { result } = renderWrappedHook(() => useMissionModal(), deps);
      await waitFor(async () => {
        await result.current.restoreMissionModal[0]();
        expect(deps.nativeHelperService.storage.get).toBeCalled();
      });
    });

    it('should set the seen mission modal status', async () => {
      const { result } = renderWrappedHook(() => useMissionModal(), deps);
      await waitFor(async () => {
        await result.current.setMissionModal[0](true);
        expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.MISSION_AFTER_PURCHASE_MODAL, { hasSeenMissionModal: true });
      });
    });
  });

  describe('usePNPrompt', () => {
    let reducer: any;
    const originalDateNow = Date.now.bind(null);
    beforeEach(() => {
      reducer = jest.fn();
      deps = getMockDeps();
      Date.now = () => 1980;
    });

    afterEach(() => {
      Date.now = originalDateNow;
    });

    it('should NOT prompt when permission was already granted', async () => {
      deps.nativeHelperService.messaging.hasPermission = (async () => true) as any;
      const { result } = renderWrappedHook(() => usePNPrompt(true), deps, undefined, reducer);
      await waitFor(async () => {
        await result.current[0]();
        expect(reducer).not.toBeCalledWith(expect.any(Object), expect.objectContaining({ type: ACTION_TYPE.ADD_MODAL }));
      });
    });

    it('should NOT prompt when permission to little time has passed from last prompt', async () => {
      deps.nativeHelperService.messaging.hasPermission = (async () => false) as any;
      deps.nativeHelperService.storage.get = async () => 1979 as any;
      const { result } = renderWrappedHook(() => usePNPrompt(true), deps, undefined, reducer);
      await waitFor(async () => {
        await result.current[0]();
        expect(reducer).not.toBeCalledWith(expect.any(Object), expect.objectContaining({ type: ACTION_TYPE.ADD_MODAL }));
      });
    });

    it('should prompt when never prompted before', async () => {
      deps.nativeHelperService.messaging.hasPermission = (async () => false) as any;
      deps.nativeHelperService.storage.get = async () => null;
      const { result } = renderWrappedHook(() => usePNPrompt(true), deps, undefined, reducer);
      await waitFor(async () => {
        await result.current[0]();
        expect(reducer).toBeCalledWith(expect.any(Object), expect.objectContaining({ type: ACTION_TYPE.ADD_MODAL }));
      });
    });

    it('should prompt when too much time has passed since last prompted', async () => {
      Date.now = () => 1980;
      deps.nativeHelperService.messaging.hasPermission = (async () => false) as any;
      deps.nativeHelperService.storage.get = (async () => (ENV.PN_DAYS_TO_REQUEST_PERMISSION * 24 * 60 * 60 * 1000 * 2 + 1980) * -1) as any;
      const { result } = renderWrappedHook(() => usePNPrompt(true), deps, undefined, reducer);
      await waitFor(async () => {
        await result.current[0]();
        expect(reducer).toBeCalledWith(expect.any(Object), expect.objectContaining({ type: ACTION_TYPE.ADD_MODAL }));
      });
    });

    it(`should prompt when the difference of days between the date today and the last prompted date are equal to ${ENV.PN_DAYS_TO_REQUEST_PERMISSION}`, async () => {
      Date.now = () => 1980;
      deps.nativeHelperService.messaging.hasPermission = (async () => false) as any;
      deps.nativeHelperService.storage.get = (async () => (ENV.PN_DAYS_TO_REQUEST_PERMISSION * 24 * 60 * 60 * 1000 + 1980) * -1) as any;
      const { result } = renderWrappedHook(() => usePNPrompt(true), deps, undefined, reducer);
      await waitFor(async () => {
        await result.current[0]();
        expect(reducer).toBeCalledWith(expect.any(Object), expect.objectContaining({ type: ACTION_TYPE.ADD_MODAL }));
      });
    });

    it('should NOT prompt when the user is visiting the earn section for the first time', async () => {
      Date.now = () => 1980;
      deps.nativeHelperService.messaging.hasPermission = (async () => false) as any;
      deps.nativeHelperService.storage.get = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(async () => [(ENV.PN_DAYS_TO_REQUEST_PERMISSION * 24 * 60 * 60 * 1000 * 2 + 1980) * -1]);
      const { result } = renderWrappedHook(() => usePNPrompt(true), deps, undefined, reducer);
      await waitFor(async () => {
        await result.current[0](true);
        expect(reducer).not.toBeCalledWith(expect.any(Object), expect.objectContaining({ type: ACTION_TYPE.ADD_MODAL }));
        expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.HAS_VISITED_MAIN_SECTION, true);
      });
    });

    it('should save the timestamp when prompt is needed', async () => {
      deps.nativeHelperService.messaging.hasPermission = (async () => false) as any;
      deps.nativeHelperService.storage.get = async () => null;
      const { result } = renderWrappedHook(() => usePNPrompt(true), deps, undefined, reducer);
      await waitFor(async () => {
        await result.current[0]();
        expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.LAST_TIME_PN_PERMISSION_ASKED, 1980);
      });
    });
  });

  describe('useExpirePointsBannerDataSet', () => {
    it('should get expire points data set', async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ lastAcceptedDate: 1, lastPointsDate: 2 } as IExpirePointsBannerDataSet);
      const { result } = renderWrappedHook(() => useExpirePointsBannerDataSet(), deps);
      await waitFor(async () => {
        await result.current.getExpirePointsBannerDataSet();
        expect(deps.nativeHelperService.storage.get).toBeCalledWith(ENV.STORAGE_KEY.EXPIRE_POINTS_BANNER);
        expect(deps.logger.debug).toBeCalledWith('useExpirePointsBannerDataSet', 'retrieved data', { lastAcceptedDate: 1, lastPointsDate: 2 });
      });
    });

    it('should get expire points data set when there is no set', async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(null);
      const { result } = renderWrappedHook(() => useExpirePointsBannerDataSet(), deps);
      await waitFor(async () => {
        await result.current.getExpirePointsBannerDataSet();
        expect(deps.nativeHelperService.storage.get).toBeCalledWith(ENV.STORAGE_KEY.EXPIRE_POINTS_BANNER);
        expect(deps.logger.debug).not.toBeCalledWith('useExpirePointsBannerDataSet', 'retrieved data', expect.any(Object));
      });
    });

    it('should set expire points data set', async () => {
      const memberOwnExpiryDate = Date.now() + 5000;
      initialState.game.current.balance.memberOwnPointsToExpire = [{ memberOwnExpiryDate, memberOwnPoints: 6 }];
      deps.stateSnapshot.get = () => initialState;
      const { result } = renderWrappedHook(() => useExpirePointsBannerDataSet(), deps, initialState);
      await waitFor(async () => {
        await result.current.setExpirePointsBannerDataSet();
        expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.EXPIRE_POINTS_BANNER, {
          lastAcceptedDate: expect.any(Number),
          lastPointsDate: memberOwnExpiryDate
        });
        expect(deps.logger.debug).toBeCalledWith('useExpirePointsBannerDataSet', 'data was set', {
          lastAcceptedDate: expect.any(Number),
          lastPointsDate: memberOwnExpiryDate
        });
      });
    });

    it('should set expire points data set when there is no set', async () => {
      initialState.game.current.balance.memberOwnPointsToExpire = [];
      deps.stateSnapshot.get = () => initialState;
      const { result } = renderWrappedHook(() => useExpirePointsBannerDataSet(), deps, initialState);
      await waitFor(async () => {
        await result.current.setExpirePointsBannerDataSet();
        expect(deps.nativeHelperService.storage.set).toBeCalled();
        expect(deps.logger.debug).toBeCalledWith('useExpirePointsBannerDataSet', 'data was set', expect.any(Object));
      });
    });
  });

  describe('useExperimentsRemoteConfig', () => {
    it('should get an empty remote configuration for AB testing experiment', async () => {
      const abTestingConfig = { some_remote_config: { _value: 'some_value' } };
      const testingResult = {};
      deps.remoteConfigService.getAll = (async () => abTestingConfig) as any;
      const { result, mockReducer } = renderWrappedHook(() => useExperimentsRemoteConfig(), deps);
      await waitFor(async () => {
        await result.current();
        expect(mockReducer).toBeCalledWith(initialState, actions.setExperimentsConfig(testingResult));
      });
    });
    it('should get the remote configuration for AB testing experiment', async () => {
      let experimentKey = ENV.EXPERIMENTS.AB_IOS_NEW_NON_ECM_BANNER_DEV;
      const abTestingConfig = { [experimentKey]: { _value: 'some_value' } };
      const testingResult = { [experimentKey]: 'some_value' };
      deps.remoteConfigService.getAll = (async () => abTestingConfig) as any;
      const { result, mockReducer } = renderWrappedHook(() => useExperimentsRemoteConfig(), deps);
      await waitFor(async () => {
        await result.current();
        expect(mockReducer).toBeCalledWith(initialState, actions.setExperimentsConfig(testingResult));
      });
    });
    it('should get empty remote configuration for AB testing experiment', async () => {
      deps.remoteConfigService.getAll = (async () => {}) as any;
      deps.remoteConfigService.getImmediateAll = (() => {}) as any;
      const { result, mockReducer } = renderWrappedHook(() => useExperimentsRemoteConfig(), deps);
      await waitFor(async () => {
        await result.current();
        expect(mockReducer).toBeCalledWith(initialState, actions.setExperimentsConfig({}));
      });
    });
    it('should get undefined remote configuration for AB testing experiment', async () => {
      deps.remoteConfigService.getAll = (async () => undefined) as any;
      deps.remoteConfigService.getImmediateAll = (() => undefined) as any;
      const { result, mockReducer } = renderWrappedHook(() => useExperimentsRemoteConfig(), deps);
      await waitFor(async () => {
        await result.current();
        expect(mockReducer).toBeCalledWith(initialState, actions.setExperimentsConfig({}));
      });
    });
    it('should get null remote configuration for AB testing experiment', async () => {
      deps.remoteConfigService.getAll = (async () => null) as any;
      deps.remoteConfigService.getImmediateAll = (() => null) as any;
      const { result, mockReducer } = renderWrappedHook(() => useExperimentsRemoteConfig(), deps);
      await waitFor(async () => {
        await result.current();
        expect(mockReducer).toBeCalledWith(initialState, actions.setExperimentsConfig({}));
      });
    });
  });
});

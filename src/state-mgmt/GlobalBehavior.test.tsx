import React, { useContext } from 'react';
import { View, Text, NativeEventSubscription } from 'react-native';
import { act } from 'react-test-renderer';
import { CommonActions } from '@react-navigation/native';
import { fireEvent, waitFor } from '@testing-library/react-native';
import moment from 'moment';

import { ENV, ForterActionType, pushNotificationTypes, ROUTES, ROUTES_IGNORED_BY_TRACKER, TealiumEventType } from '_constants';
import { Deps, IGlobalState } from '_models/general';
import { LogMethod } from '_services/Logger';
import { getGame, getGiftCard } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getStateSnapshotStorage } from '_utils/getStateSnapshotStorage';
import { noop } from '_utils/noop';
import { wait } from '_utils/wait';
import { actions } from '_state_mgmt/core/actions';
import { GlobalBehavior, Props } from './GlobalBehavior';
import { getInitialState, GlobalContext } from './GlobalState';

const mockUseLogout = jest.fn();
jest.mock('./auth/hooks', () => ({
  __esModule: true,
  useLogout: () => [mockUseLogout]
}));

describe('GlobalState', () => {
  let deps: Deps;
  let props: Props;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    props = {
      navigationRef: { current: { getCurrentRoute: () => ({ name: undefined }), dispatch: jest.fn(), navigate: jest.fn() } } as any
    };
  });

  it('should listen to network connection changes', async () => {
    const CompoForNetwork = () => {
      const { state } = useContext(GlobalContext);
      return (
        <View>
          <Text testID="state">{JSON.stringify(state.core.isConnected)}</Text>
        </View>
      );
    };
    deps.nativeHelperService.platform.select = jest.fn().mockResolvedValue({ buttonAppId: 'fakeButtonId' });
    deps.nativeHelperService.netInfo.subscribeToConnectionChanges = ((cb: (arg: boolean) => void) => {
      setTimeout(() => cb(false));
    }) as any;
    const { getByTestId } = renderWithGlobalContext(
      <GlobalBehavior {...props}>
        <CompoForNetwork />
      </GlobalBehavior>,
      deps
    );
    expect(getByTestId('state').props.children).toEqual('true'); // initial value
    await act(() => wait(0));
    expect(getByTestId('state').props.children).toEqual('false'); // value after connection changed
  });

  it('should have side effects when the app changes from background to active', async () => {
    deps.stateSnapshot = getStateSnapshotStorage();
    deps.nativeHelperService.appState.currentState = 'background';
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      fn('active');
      return { remove: noop };
    };
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith(TealiumEventType.BACK_TO_FOREGROUND, expect.any(Object));
    await act(() => wait(0));
  });

  it('should have side effects when the app changes from active to background', async () => {
    deps.stateSnapshot = getStateSnapshotStorage();
    deps.nativeHelperService.appState.currentState = 'active';
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      fn('background');
      return { remove: noop };
    };
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith(TealiumEventType.BACKGROUND, expect.any(Object));
    await act(() => wait(0));
  });

  it('should NOT have side effects when the app changes from background to active and token is not available', async () => {
    deps.stateSnapshot = getStateSnapshotStorage();
    deps.nativeHelperService.appState.currentState = 'background';
    deps.apiService.isTokenSetCurrentlyReady = () => false;
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      fn('active');
      return { remove: noop };
    };
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.eventTrackerService.tealiumSDK.track).not.toBeCalledWith(TealiumEventType.BACK_TO_FOREGROUND, expect.any(Object));
    await act(() => wait(0));
  });

  it('should navigate to forced update screen if showForcedUpdate screen is true', async () => {
    deps.stateSnapshot = getStateSnapshotStorage();
    deps.nativeHelperService.appState.currentState = 'background';
    deps.apiService.isTokenSetCurrentlyReady = () => true;
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      fn('active');
      return { remove: noop };
    };
    const state = { ...initialState, core: { ...initialState.core, showForcedUpdateScreen: true } };
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps, state);
    await act(() => wait(0));
    expect(props.navigationRef.current.navigate).toBeCalledWith(ROUTES.FORCED_UPDATE_MODAL);
  });

  it('should add logger events listeners to track events', async () => {
    deps.logger.addEventListener = jest.fn((method, fn) => fn({ method, argList: ['message', { metadata1: 1, metadata2: 2 }] }));
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));

    expect(deps.logger.addEventListener).toBeCalledWith(LogMethod.DEBUG, expect.any(Function));
    expect(deps.logger.addEventListener).toBeCalledWith(LogMethod.INFO, expect.any(Function));
    expect(deps.logger.addEventListener).toBeCalledWith(LogMethod.WARN, expect.any(Function));
    expect(deps.logger.addEventListener).toBeCalledWith(LogMethod.ERROR, expect.any(Function));

    expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith(TealiumEventType.ERROR, expect.any(Object));
    expect(deps.crashlyticsService.recordError).toBeCalledWith(new Error('message'), { metadata1: 1, metadata2: 2 });
    expect(deps.crashlyticsService.recordError).toBeCalledWith(new Error('message'), { metadata1: 1, metadata2: 2 });

    await act(() => wait(0));
  });

  it('should add logger events listeners to track events (metadata key collision)', async () => {
    deps.logger.addEventListener = jest.fn((method, fn) => fn({ method, argList: ['message', { metadata: 1 }, { metadata: 2 }] }));
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.crashlyticsService.recordError).toBeCalledWith(new Error('message'), { metadata: 1, metadata_2: 2 });
  });

  it('should add logger events listeners to track events (metadata multiple types)', async () => {
    deps.logger.addEventListener = jest.fn((method, fn) => fn({ method, argList: ['message', 'my string', 2, true, [4], { object: 5 }] }));
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.crashlyticsService.recordError).toHaveBeenCalledWith(new Error('message'), {
      unnamed_1: 'my string',
      unnamed_2: 2,
      unnamed_3: true,
      unnamed_4: [4],
      object: 5
    });
  });

  it('should add logger events listeners to track events (no metadata)', async () => {
    deps.logger.addEventListener = jest.fn((method, fn) => fn({ method, argList: ['message'] }));
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.crashlyticsService.recordError).toBeCalledWith(new Error('message'), {});
  });

  it('should add logger events listeners to track events (w/error, no metadata)', async () => {
    deps.logger.addEventListener = jest.fn((method, fn) => fn({ method, argList: [new Error('message')] }));
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.crashlyticsService.recordError).toBeCalledWith(new Error('message'), {});
  });

  it('should track route changes', async () => {
    deps.stateSnapshot.get = () => ({ ...initialState, core: { ...initialState.core, lastRouteKey: 'prev-route' } });
    props.navigationRef.current.getCurrentRoute = () => ({ name: 'route' } as any);
    props.navigationRef.current.addListener = jest.fn(((_, fn) => fn()) as any);
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.eventTrackerService.tealiumSDK.trackView).toBeCalledWith('route', expect.any(Object));
    expect(deps.eventTrackerService.rZero.trackView).toBeCalledWith('prev-route', false);
    expect(deps.eventTrackerService.rZero.trackView).toBeCalledWith('route', true);
  });

  it("should not track route changes if the route doesn't change", async () => {
    deps.stateSnapshot.get = () => ({ ...initialState, core: { ...initialState.core, lastRouteKey: 'route-name' } });
    props.navigationRef.current.getCurrentRoute = () => ({ name: 'route-name' } as any);
    props.navigationRef.current.addListener = jest.fn(((_, fn) => fn()) as any);
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.eventTrackerService.tealiumSDK.trackView).not.toBeCalled();
    expect(deps.eventTrackerService.rZero.trackView).not.toBeCalled();
    expect(deps.eventTrackerService.rZero.trackView).not.toBeCalled();
  });

  it('should NOT track an ignored route', async () => {
    props.navigationRef.current.getCurrentRoute = () => ({ name: ROUTES_IGNORED_BY_TRACKER[0] } as any);
    props.navigationRef.current.addListener = jest.fn(((_, fn) => fn()) as any);
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.eventTrackerService.tealiumSDK.trackView).not.toBeCalled();
  });

  it('should NOT track rZero navigation leaving when there are no previous routes', async () => {
    deps.stateSnapshot.get = () => initialState;
    props.navigationRef.current.getCurrentRoute = () => ({ name: 'route' } as any);
    props.navigationRef.current.addListener = jest.fn(((_, fn) => fn()) as any);
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.eventTrackerService.rZero.trackView).not.toBeCalledWith(expect.any(String), false);
  });

  it('should flush the rZero event cache when it is going to the raise checkout', async () => {
    deps.stateSnapshot.get = () => ({
      ...initialState,
      core: { ...initialState.core, lastRouteKey: ROUTES.GIFT_CARD_DETAIL }
    });
    props.navigationRef.current.getCurrentRoute = jest.fn().mockReturnValue({ name: ROUTES.GIFT_CARD_CHECKOUT });
    props.navigationRef.current.addListener = jest.fn(((_, fn) => fn()) as any);

    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);

    await act(() => wait(0));
    expect(deps.eventTrackerService.rZero.flush).toBeCalled();
  });

  it('should flush the game state cache when coming back from the raise checkout', async () => {
    initialState.giftCard.giftCardsList = [];
    deps.stateSnapshot.get = () => ({
      ...initialState,
      core: { ...initialState.core, lastRouteKey: ROUTES.GIFT_CARD_CHECKOUT }
    });

    deps.apiService.fetchGiftCardList = jest.fn().mockResolvedValueOnce({ giftCards: [getGiftCard()] });
    props.navigationRef.current.addListener = jest.fn(((_, fn) => fn()) as any);

    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await waitFor(() => {
      expect(deps.apiService.fetchGiftCardList).toBeCalled();
      expect(deps.apiService.fetchGameState).toBeCalled();
    });
  });

  it('should register device info when FCM token changes', async () => {
    const timeout = 100;
    deps.nativeHelperService.deviceInfo.onFCMTokenRefresh = cb => setTimeout(cb, timeout);
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    expect(deps.logger.debug).not.toBeCalledWith('useRegisterDeviceInfo');
    await act(() => wait(timeout));
    expect(deps.logger.debug).toBeCalledWith('useRegisterDeviceInfo');
  });

  it('should check for updates', async () => {
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
  });

  it('should get expire points data set', async () => {
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
  });

  it('should track when the app is pressed', async () => {
    const { getByTestId } = renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    fireEvent(getByTestId('global-behavior-container'), 'onTouchStart', { nativeEvent: { pageX: 1, pageY: 2 } });
    await act(() => wait(0));
    expect(deps.eventTrackerService.forterSDK.fraudTrackAction).toBeCalledWith(ForterActionType.TAP, { x: 1, y: 2 });
  });

  it('should refresh app if token is invalid', () => {
    (deps.apiService as any).isTokenInvalid = true;
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    expect(mockUseLogout).toBeCalled();
  });

  it('should set RZero token if not set', () => {
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);

    expect(deps.eventTrackerService.rZero.setUser).toBeCalled();
  });

  it('should not set RZero token if already set', () => {
    const state = { ...initialState, core: { ...initialState.core, roToken: 'roToken' } };
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps, state);

    expect(deps.eventTrackerService.rZero.setUser).not.toBeCalled();
  });

  it.each(Object.values(pushNotificationTypes))(
    'should redirect to a route when a push notification is tapped and eventType is equal to %o',
    async eventType => {
      deps.apiService.fetchGameState = jest.fn().mockResolvedValue({
        ...getGame()
      });

      deps.nativeHelperService.platform.OS = 'android';
      deps.nativeHelperService.sailthru.onNotificationTapped = jest.fn(cb => {
        cb({ eventType: eventType });
        return () => {};
      }) as any;
      renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
      let route;
      let params;
      switch (eventType) {
        case pushNotificationTypes.USER_INACTIVE:
        case pushNotificationTypes.MARKETING:
        case pushNotificationTypes.USER_BIRTHDAY:
          route = ROUTES.MAIN;
          break;
        case pushNotificationTypes.MISSION_COMPLETE:
        case pushNotificationTypes.BALANCE_NEW_POINTS:
          route = ROUTES.POINT_HISTORY;
          break;
        case pushNotificationTypes.BALANCE_EXPIRING_POINTS:
        case pushNotificationTypes.BALANCE_UNUSED_POINTS:
          route = ROUTES.MAIN;
          params = {
            screen: ROUTES.MAIN_TAB.MAIN,
            params: {
              screen: ROUTES.MAIN_TAB.REWARDS
            }
          };
          break;
      }
      if (params) {
        expect(props.navigationRef.current.navigate).toBeCalledWith(route, params);
      } else expect(props.navigationRef.current.navigate).toBeCalledWith(route);
    }
  );

  it('should save the sid parameter from deep link', async () => {
    initialState.core.isAppReady = true;
    deps.eventTrackerService.appsFlyerSDK.addDeepLinkEventListener = h => h({ data: { sid: 'sid' } } as any);
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.SID, expect.objectContaining({ sid: 'sid' }));
  });

  it('should update the sid value when app changes from active to background', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ sid: 'sid', inactiveDate: '2021-07-20T12:00:00.000Z' });
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      fn('background');
      return { remove: noop };
    };
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.SID, expect.objectContaining({ sid: 'sid' }));
  });

  it('should remove sid when time in background exceeds the limit', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ sid: 'sid', inactiveDate: '2021-07-20T12:00:00.000Z' });
    deps.nativeHelperService.appState.currentState = 'background';
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      fn('active');
      return { remove: noop };
    };
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.nativeHelperService.storage.remove).toBeCalledWith(ENV.STORAGE_KEY.SID);
  });

  it('should not remove sid when time in background not exceeds the limit (remove inactive date)', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ sid: 'sid', inactiveDate: moment() });
    deps.nativeHelperService.appState.currentState = 'background';
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      fn('active');
      return { remove: noop };
    };
    renderWithGlobalContext(<GlobalBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(deps.nativeHelperService.storage.remove).not.toBeCalledWith(ENV.STORAGE_KEY.SID);
    expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.SID, expect.objectContaining({ sid: 'sid', inactiveDate: null }));
  });

  it('should set deepLink state value when is a deep link and navigate', async () => {
    initialState.core.isAppReady = true;
    initialState.user.currentUser.sywUserId = 'sywUserId';
    deps.eventTrackerService.appsFlyerSDK.addDeepLinkEventListener = h =>
      h({ data: { deep_link_value: `${ENV.SCHEME}earn/offer`, brandRequestorId: 'UBER' } } as any);
    const { mockReducer } = renderWithGlobalContext(<GlobalBehavior {...props} />, deps, initialState);
    await waitFor(() => {
      expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setDeepLink('earn/offer', { brandRequestorId: 'UBER' }));
      expect(props.navigationRef.current.dispatch).toBeCalledWith(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: ROUTES.MAIN },
            {
              name: 'earn/offer',
              params: { brandRequestorId: 'UBER' }
            }
          ]
        })
      );
    });
  });

  it('should set deepLink state value when is a deep link without params', async () => {
    deps.eventTrackerService.appsFlyerSDK.addDeepLinkEventListener = h => h({ data: { deep_link_value: `${ENV.SCHEME}earn/offer` } } as any);
    const { mockReducer } = renderWithGlobalContext(<GlobalBehavior {...props} />, deps, initialState);
    await waitFor(() => {
      expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setDeepLink('earn/offer', {}));
    });
  });
});

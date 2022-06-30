import { waitFor } from '@testing-library/react-native';
import { NativeEventSubscription } from 'react-native';
import { usePushNotificationsPermission } from './usePushNotificationsPermission';
const {
  RESULTS: { GRANTED, DENIED }
} = require('react-native-permissions/mock');

import { Deps } from '_models/general';

import { getStateSnapshotStorage } from '_utils/getStateSnapshotStorage';
import { noop } from '_utils/noop';

import { renderWrappedHook } from '_test_utils/renderWrappedHook';
import { getMockDeps } from '_test_utils/getMockDeps';
import { TealiumEventType } from '_constants';

describe('usePushNotificationsPermission', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should catch errors getting the push notifications permission (iOS)', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    (deps.nativeHelperService.reactNativePermission.checkNotifications as jest.Mock).mockRejectedValueOnce(null);

    const { result } = renderWrappedHook(() => usePushNotificationsPermission(), deps);
    await waitFor(async () => {
      await result.current.handleNotificationPermissionCheck();
      expect(deps.logger.error).toBeCalled();
    });
  });

  it('should catch errors getting the push notification permission when push notification permission is requested for ios', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    (deps.nativeHelperService.messaging.requestPermission as jest.Mock).mockRejectedValueOnce(null);

    const { result } = renderWrappedHook(() => usePushNotificationsPermission(), deps);
    await waitFor(async () => {
      await result.current.handlePushNotifications();
      expect(deps.logger.error).toBeCalled();
    });
  });

  it('should not open settings when the user taps on the dont allow button when push notifications permission is requested on ios', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    (deps.nativeHelperService.reactNativePermission.checkNotifications as jest.Mock).mockReturnValue({ status: DENIED });
    (deps.nativeHelperService.messaging.requestPermission as jest.Mock).mockReturnValue(deps.nativeHelperService.pushNotificationsAuthStatus.DENIED);
    const { result } = renderWrappedHook(() => usePushNotificationsPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleNotificationPermissionCheck()).toEqual(DENIED);
      await result.current.handlePushNotifications();
      expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith(TealiumEventType.SET_PN_PREFERENCE, expect.any(Object));
    });
  });

  it('should not open settings when the user taps on the allow button when push notifications permission is requested on ios', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    (deps.nativeHelperService.reactNativePermission.checkNotifications as jest.Mock).mockReturnValue({ status: DENIED });
    (deps.nativeHelperService.messaging.requestPermission as jest.Mock).mockReturnValue(deps.nativeHelperService.pushNotificationsAuthStatus.AUTHORIZED);

    const { result } = renderWrappedHook(() => usePushNotificationsPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleNotificationPermissionCheck()).toEqual(DENIED);
      await result.current.handlePushNotifications();
      expect(deps.nativeHelperService.reactNativePermission.openSettings).not.toBeCalled();
    });
  });

  it('should open settings when handlePushNotifications is called on android', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    const { result } = renderWrappedHook(() => usePushNotificationsPermission(), deps);
    await waitFor(async () => {
      await result.current.handlePushNotifications();
      expect(deps.eventTrackerService.tealiumSDK.track).not.toBeCalled();
      expect(deps.nativeHelperService.reactNativePermission.openSettings).toBeCalled();
    });
  });

  it('should update the push notifications permission status when app comes back from background', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    deps.stateSnapshot = getStateSnapshotStorage();
    (deps.nativeHelperService.reactNativePermission.checkNotifications as jest.Mock).mockReturnValue({ status: GRANTED }).mockReturnValue({ status: DENIED });
    deps.nativeHelperService.appState.currentState = 'background';
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      fn('active');
      return { remove: noop };
    };

    const { result } = renderWrappedHook(() => usePushNotificationsPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleNotificationPermissionCheck()).toEqual(DENIED);
    });
  });

  it('should not update the push notifications permission status when app status did not change to active', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    deps.stateSnapshot = getStateSnapshotStorage();
    (deps.nativeHelperService.reactNativePermission.checkNotifications as jest.Mock)
      .mockReturnValueOnce({ status: GRANTED })
      .mockReturnValueOnce({ status: DENIED });
    deps.nativeHelperService.appState.currentState = 'background';
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      fn('background');
      return { remove: noop };
    };

    const { result } = renderWrappedHook(() => usePushNotificationsPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleNotificationPermissionCheck()).toEqual(GRANTED);
    });
  });
});

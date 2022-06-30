import { waitFor } from '@testing-library/react-native';
import navigation from '@react-navigation/native';
import { NativeEventSubscription } from 'react-native';
const {
  PERMISSIONS: {
    IOS: { LOCATION_WHEN_IN_USE, LOCATION_ALWAYS }
  },
  RESULTS: { BLOCKED, DENIED, GRANTED }
} = require('react-native-permissions/mock');

import { useLocationPermission } from './useLocationPermission';

import { Deps } from '_models/general';

import { getStateSnapshotStorage } from './getStateSnapshotStorage';
import { noop } from './noop';

import { renderWrappedHook } from '_test_utils/renderWrappedHook';
import { getMockDeps } from '_test_utils/getMockDeps';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return { useNavigation: () => ({ navigate: mockedNavigate }) };
});

describe('useLocationPermission', () => {
  let deps: Deps;

  beforeEach(() => {
    navigation.useIsFocused = jest.fn(() => false);
    deps = getMockDeps();
  });

  it('should return location permission enabled for ios', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    (deps.nativeHelperService.reactNativePermission.checkMultiple as jest.Mock).mockReturnValueOnce({
      [LOCATION_WHEN_IN_USE]: GRANTED,
      [LOCATION_ALWAYS]: GRANTED
    });

    const { result } = renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleLocationPermissionCheck()).toEqual(GRANTED);
    });
  });

  it('should return location permission enabled for ios when is focused', async () => {
    navigation.useIsFocused = jest.fn(() => true);
    deps.nativeHelperService.platform.OS = 'ios';
    (deps.nativeHelperService.reactNativePermission.checkMultiple as jest.Mock).mockReturnValueOnce({
      [LOCATION_WHEN_IN_USE]: GRANTED,
      [LOCATION_ALWAYS]: GRANTED
    });

    renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(() => {
      expect(deps.nativeHelperService.reactNativePermission.checkMultiple).toBeCalled();
    });
  });

  it('should return location permission disabled for ios', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    (deps.nativeHelperService.reactNativePermission.checkMultiple as jest.Mock).mockReturnValueOnce({
      [LOCATION_WHEN_IN_USE]: BLOCKED,
      [LOCATION_ALWAYS]: BLOCKED
    });

    const { result } = renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleLocationPermissionCheck()).toEqual(BLOCKED);
    });
  });

  it('should return location permission granted when location permission is requested for ios', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(DENIED);
    (deps.nativeHelperService.reactNativePermission.request as jest.Mock).mockReturnValueOnce(GRANTED);
    (deps.nativeHelperService.reactNativePermission.checkMultiple as jest.Mock).mockReturnValueOnce({
      [LOCATION_WHEN_IN_USE]: GRANTED,
      [LOCATION_ALWAYS]: GRANTED
    });

    const { result } = renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleLocationPermission()).toEqual(GRANTED);
    });
  });

  it('should return location permission blocked when location permission is requested for ios', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(DENIED);
    (deps.nativeHelperService.reactNativePermission.request as jest.Mock).mockReturnValueOnce(BLOCKED);
    (deps.nativeHelperService.reactNativePermission.checkMultiple as jest.Mock).mockReturnValueOnce({
      [LOCATION_WHEN_IN_USE]: BLOCKED,
      [LOCATION_ALWAYS]: BLOCKED
    });

    const { result } = renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleLocationPermission()).toEqual(BLOCKED);
    });
  });

  it('should catch errors getting the location permission for ios', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    (deps.nativeHelperService.reactNativePermission.checkMultiple as jest.Mock).mockRejectedValueOnce(null);

    const { result } = renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(async () => {
      await result.current.handleLocationPermissionCheck();
      expect(deps.logger.error).toBeCalled();
    });
  });

  it('should catch errors getting the location permission when location permission is requested for ios', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockRejectedValueOnce(null);

    const { result } = renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(async () => {
      await result.current.handleLocationPermission();
      expect(deps.logger.error).toBeCalled();
    });
  });

  it('should return location permission enabled for android', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(GRANTED);

    const { result } = renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleLocationPermissionCheck()).toEqual(GRANTED);
    });
  });

  it('should return location permission disabled for android', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(BLOCKED);

    const { result } = renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleLocationPermissionCheck()).toEqual(BLOCKED);
    });
  });

  it('should return previous location permission when location permission is different to denied for android', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(BLOCKED);

    const { result } = renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleLocationPermission()).toEqual(BLOCKED);
    });
  });

  it('should return location permission granted when location permission is requested for android', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(DENIED).mockReturnValueOnce(GRANTED);
    (deps.nativeHelperService.reactNativePermission.request as jest.Mock).mockReturnValueOnce(GRANTED);

    const { result } = renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleLocationPermission()).toEqual(GRANTED);
    });
  });

  it('should catch errors getting the location permission when location permission is requested for android', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockRejectedValueOnce(null);

    const { result } = renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(async () => {
      await result.current.handleLocationPermission();
      expect(deps.logger.error).toBeCalled();
    });
  });

  it('should update the location permission status when app comes back from background or foreground', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    deps.stateSnapshot = getStateSnapshotStorage();
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(DENIED).mockReturnValueOnce(GRANTED);
    deps.nativeHelperService.appState.currentState = 'background';
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      fn('active');
      return { remove: noop };
    };

    const { result } = renderWrappedHook(() => useLocationPermission(), deps);
    await waitFor(async () => {
      expect(await result.current.handleLocationPermissionCheck()).toEqual(GRANTED);
    });
  });
});

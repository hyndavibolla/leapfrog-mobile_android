import React from 'react';
import { CommonActions } from '@react-navigation/native';
import { act } from 'react-test-renderer';
import { waitFor } from '@testing-library/react-native';

import { ENV, ROUTES } from '_constants';
import { Deps, IGlobalState, ITokenSet } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';
import AppStartBehavior, { Props } from './AppStartBehavior';

const validToken = {
  accessToken: 'accessToken',
  accessTokenExpiryTime: 'accessTokenExpiryTime',
  refreshToken: 'refreshToken',
  deviceId: 'deviceId'
} as ITokenSet;

describe('AppStartBehavior', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    initialState.core.isDeepLinkListenerReady = true;
    props = {
      navigationRef: { current: { dispatch: jest.fn(), reset: jest.fn() } } as any
    };
  });

  it('should render with a critical error', async () => {
    deps.nativeHelperService.storage.get = Promise.reject;
    const { queryByTestId } = renderWithGlobalContext(<AppStartBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(queryByTestId('critical-error-container')).toBeTruthy();
  });

  it('should navigate to the LOGIN screen when splash is over, token is NOT found and the ONBOARDING has been seen', async () => {
    deps.nativeHelperService.storage.get = jest
      .fn()
      .mockResolvedValueOnce(null) // tokenSet
      .mockResolvedValueOnce('deviceId')
      .mockResolvedValueOnce({ seenOnboarding: true }) // onboarding
      .mockResolvedValueOnce('deviceId');

    renderWithGlobalContext(<AppStartBehavior {...props} />, deps, { ...initialState, core: { ...initialState.core, showForcedUpdateScreen: false } });
    await act(() => wait(ENV.SPLASH_MIN_ANIMATION_TIME_MS + 500));
    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(1, ENV.STORAGE_KEY.TOKEN_SET);
    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(2, ENV.STORAGE_KEY.DEVICE_ID);
    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(3, ENV.STORAGE_KEY.ONBOARDING);
    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(4, ENV.STORAGE_KEY.DEVICE_ID);
    expect(deps.logger.debug).toHaveBeenCalledWith('restoreSeenOnboarding');
    expect(deps.logger.debug).toHaveBeenCalledWith('useRestoreSession', expect.anything());
    expect(props.navigationRef.current.dispatch).toBeCalledWith(CommonActions.navigate(ROUTES.LOGIN, {}));
  });

  it('should navigate to the ONBOARDING screen when splash is over, token is NOT found and the ONBOARDING has not been seen', async () => {
    deps.nativeHelperService.storage.get = jest
      .fn()
      .mockResolvedValueOnce(null) // tokenSet
      .mockResolvedValueOnce('deviceId')
      .mockResolvedValueOnce({ seenOnboarding: false }) // onboarding
      .mockResolvedValueOnce('deviceId');
    renderWithGlobalContext(<AppStartBehavior {...props} />, deps, { ...initialState, core: { ...initialState.core, showForcedUpdateScreen: false } });
    await waitFor(() => {
      expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(1, ENV.STORAGE_KEY.TOKEN_SET);
      expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(2, ENV.STORAGE_KEY.DEVICE_ID);
      expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(3, ENV.STORAGE_KEY.ONBOARDING);
      expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(4, ENV.STORAGE_KEY.DEVICE_ID);
      expect(deps.logger.debug).toHaveBeenCalledWith('restoreSeenOnboarding');
      expect(deps.logger.debug).toHaveBeenCalledWith('useRestoreSession', expect.anything());
      expect(props.navigationRef.current.dispatch).toBeCalledWith(CommonActions.navigate(ROUTES.TOOLTIP.ONBOARDING, {}));
    });
  });

  it('should navigate to FORCED_UPDATE_MODAL if showForcedUpdateScreen is set to true', async () => {
    deps.nativeHelperService.storage.get = jest
      .fn()
      .mockResolvedValueOnce(null) // tokenSet
      .mockResolvedValueOnce('deviceId')
      .mockResolvedValueOnce({ seenOnboarding: false }) // onboarding
      .mockResolvedValueOnce('deviceId');
    renderWithGlobalContext(<AppStartBehavior {...props} />, deps, { ...initialState, core: { ...initialState.core, showForcedUpdateScreen: true } });
    await waitFor(() => {
      expect(props.navigationRef.current.dispatch).toBeCalledWith(CommonActions.navigate(ROUTES.FORCED_UPDATE_MODAL, {}));
    });
  });

  it('should display an error screen if deviceId cannot be found after generated', async () => {
    deps.nativeHelperService.storage.get = jest
      .fn()
      .mockResolvedValue(null) // token
      .mockResolvedValueOnce('deviceId') // deviceId
      .mockResolvedValueOnce(null) // onboarding
      .mockResolvedValueOnce(null); // deviceId -- this should not happen

    const { queryByTestId } = renderWithGlobalContext(<AppStartBehavior {...props} />, deps);
    await act(() => wait(ENV.SPLASH_MIN_ANIMATION_TIME_MS + 500));

    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(1, ENV.STORAGE_KEY.TOKEN_SET);
    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(2, ENV.STORAGE_KEY.DEVICE_ID);
    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(3, ENV.STORAGE_KEY.ONBOARDING);
    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(4, ENV.STORAGE_KEY.DEVICE_ID);
    expect(queryByTestId('critical-error-container')).toBeTruthy();
  });

  it('should navigate to screen when splash is over, token is found and initial url is recognized', async () => {
    deps.nativeHelperService.linking.getInitialURL = jest.fn().mockResolvedValue(`${ENV.SCHEME}${ROUTES.DEV_TOOLS}`);
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(validToken);
    renderWithGlobalContext(<AppStartBehavior {...props} />, deps, initialState);
    await waitFor(() => {
      expect(props.navigationRef.current.dispatch).toBeCalledWith(
        CommonActions.reset({
          index: 1,
          routes: [{ name: ROUTES.MAIN }, { name: ROUTES.DEV_TOOLS, params: {} }]
        })
      );
    });
  });

  it('should navigate to the earn main screen when splash is over, token is found and initial url is not recognized', async () => {
    deps.nativeHelperService.linking.getInitialURL = jest.fn().mockResolvedValue(`invalid_url`);
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(validToken);
    renderWithGlobalContext(<AppStartBehavior {...props} />, deps, initialState);
    await waitFor(() => {
      expect(props.navigationRef.current.dispatch).toBeCalledWith(CommonActions.navigate(ROUTES.MAIN, {}));
    });
  });

  it('should navigate to ONBOARDING if it has not been seen', async () => {
    deps.nativeHelperService.storage.get = jest
      .fn()
      .mockResolvedValueOnce(null) // tokenSet
      .mockResolvedValueOnce('deviceId')
      .mockResolvedValueOnce({ seenOnboarding: false }) // onboarding
      .mockResolvedValueOnce('deviceId');
    renderWithGlobalContext(<AppStartBehavior {...props} />, deps, { ...initialState, core: { ...initialState.core, hasSeenOnboarding: false } });
    await waitFor(() => {
      expect(props.navigationRef.current.dispatch).toBeCalledWith(CommonActions.navigate(ROUTES.TOOLTIP.ONBOARDING, {}));
    });
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should navigate when splash is over AND other stuff is resolved', async () => {
    jest.mock('_constants', () => {
      const constants = jest.requireActual('_constants');
      return {
        ...constants,
        ENV: {
          SPLASH_MIN_ANIMATION_TIME_MS: 1000
        }
      };
    });
    const longerProcess = ENV.SPLASH_MIN_ANIMATION_TIME_MS + 500;
    deps.nativeHelperService.storage.get = jest
      .fn()
      .mockResolvedValueOnce(validToken) // tokenSet
      .mockResolvedValueOnce('deviceId')
      .mockResolvedValueOnce({ seenOnboarding: true }) // onboarding
      .mockResolvedValueOnce('deviceId');
    renderWithGlobalContext(<AppStartBehavior {...props} />, deps);
    await act(() => wait(0));
    expect(props.navigationRef.current.dispatch).not.toBeCalled();
    await act(() => wait(longerProcess));
    expect(props.navigationRef.current.dispatch).toBeCalled();
  });

  it('should migrate tokenSet.deviceId to persistent deviceId', async () => {
    const { deviceId, ...newTokenSet } = validToken;
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(validToken);

    renderWithGlobalContext(<AppStartBehavior {...props} />, deps);
    await act(() => wait(ENV.SPLASH_MIN_ANIMATION_TIME_MS));

    expect(deps.nativeHelperService.storage.set).toHaveBeenCalledWith(ENV.STORAGE_KEY.TOKEN_SET, newTokenSet);
    expect(deps.nativeHelperService.storage.set).toHaveBeenCalledWith(ENV.STORAGE_KEY.DEVICE_ID, deviceId);
  });

  it('should generate a new deviceId if none is found', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(null);

    renderWithGlobalContext(<AppStartBehavior {...props} />, deps);
    await act(() => wait(ENV.SPLASH_MIN_ANIMATION_TIME_MS));

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(deps.nativeHelperService.storage.set).toHaveBeenCalledWith(ENV.STORAGE_KEY.DEVICE_ID, expect.stringMatching(uuidRegex));

    // it should also invalidate the existing tokenSet, if any
    expect(deps.nativeHelperService.storage.remove).toHaveBeenCalledWith(ENV.STORAGE_KEY.TOKEN_SET);
  });

  it('should not navigate if deep link was set', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(validToken);
    renderWithGlobalContext(<AppStartBehavior {...props} />, deps, {
      ...initialState,
      core: { ...initialState.core, isDeepLinkListenerReady: true, deepLink: { route: `url`, params: {} } }
    });
    await waitFor(() => {
      expect(props.navigationRef.current.dispatch).not.toBeCalled();
    });
  });
});

import React from 'react';
import { act } from 'react-test-renderer';
import { CommonActions } from '@react-navigation/native';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { ENV, ROUTES } from '_constants';
import { Deps } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';
import { LoginAuth0, Props } from './LoginAuth0';

describe('Login Auth0', () => {
  let props: Props;
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
    deps.apiService.getTokenSetAsync = async () => null;
    props = {
      navigation: { dispatch: jest.fn() } as any,
      route: null
    };
  });

  it('should render', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    const { toJSON } = renderWithGlobalContext(<LoginAuth0 {...props} />, deps);
    expect(props.navigation.dispatch).not.toBeCalled();
    expect(deps.logger.debug).toBeCalledWith('useLogout', { soft: true });
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should authenticate and redirect if Token is present', async () => {
    deps.authService.webAuth.authorize = () =>
      Promise.resolve({ idToken: 'id', accessToken: 'token', refreshToken: 'refreshToken', expiresIn: 1000, scope: 'scope', tokenType: 'type' });
    props.route = { params: { token: 'fakeToken' } };
    renderWithGlobalContext(<LoginAuth0 {...props} />, deps);
    await act(() => wait(0));
    expect(deps.logger.debug).toBeCalledWith('useAuthentication');
    expect(props.navigation.dispatch).toBeCalled();
  });

  it('should reset navigation to add Earn Main as first screen if the initialUrl is not Earn Main', async () => {
    deps.authService.webAuth.authorize = () =>
      Promise.resolve({ idToken: 'id', accessToken: 'token', refreshToken: 'refreshToken', expiresIn: 1000, scope: 'scope', tokenType: 'type' });
    const notRouteMain = `${ENV.SCHEME}${ROUTES.DEV_TOOLS}`;
    deps.nativeHelperService.linking.getInitialURL = jest.fn().mockResolvedValue(notRouteMain);
    props.route = { params: { token: 'fakeToken' } };
    renderWithGlobalContext(<LoginAuth0 {...props} />, deps);
    await waitFor(() => {
      expect(deps.logger.debug).toBeCalledWith('useAuthentication');
      expect(props.navigation.dispatch).toBeCalledWith(
        CommonActions.reset({
          index: 1,
          routes: [{ name: ROUTES.MAIN }, { name: ROUTES.DEV_TOOLS, params: {} }]
        })
      );
    });
  });

  it('should render login view', async () => {
    props.route = { params: { token: 'fakeToken' } };
    const { queryByTestId } = renderWithGlobalContext(<LoginAuth0 {...props} />, deps);
    await act(() => wait(0));
    expect(queryByTestId('login-container')).toBeTruthy();
  });

  it('should open Auth0 webview when tapping Login button', async () => {
    deps.authService.webAuth.authorize = jest.fn().mockRejectedValue('error');
    props.route = { params: { token: 'fakeToken' } };
    const { getByTestId } = renderWithGlobalContext(<LoginAuth0 {...props} />, deps);
    await act(() => wait(0));
    expect(deps.authService.webAuth.authorize).toBeCalledTimes(1);

    fireEvent.press(getByTestId('login-login-btn'));
    await act(() => wait(0));
    expect(deps.authService.webAuth.authorize).toBeCalledTimes(2);
  });

  it('should open Auth0 webview when tapping register button', async () => {
    deps.authService.webAuth.authorize = jest.fn().mockRejectedValue('error');
    props.route = { params: { token: 'fakeToken' } };
    const { getByTestId } = renderWithGlobalContext(<LoginAuth0 {...props} />, deps);
    await act(() => wait(0));
    expect(deps.authService.webAuth.authorize).toBeCalledTimes(1);

    fireEvent.press(getByTestId('login-register-btn'));
    await act(() => wait(0));
    expect(deps.authService.webAuth.authorize).toBeCalledTimes(2);
  });

  it('should remove the force to logout flag', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(true);
    renderWithGlobalContext(<LoginAuth0 {...props} />, deps);
    await act(() => wait(0));
    expect(deps.nativeHelperService.storage.get).toBeCalledWith(ENV.STORAGE_KEY.FORCED_TO_LOGOUT);
  });
});

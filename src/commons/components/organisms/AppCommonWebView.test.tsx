import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';
import AppCommonWebView, { Props } from './AppCommonWebView';

describe('App Common WebView ', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      navigation: { goBack: jest.fn(), setOptions: jest.fn() } as any,
      route: { params: { title: 'Google', url: 'www.google.com' } }
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<AppCommonWebView {...props} />);
    await act(async () => await wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it("shouldn't navigate back if url is found", async () => {
    renderWithGlobalContext(<AppCommonWebView {...props} />);
    await act(async () => await wait(0));
    expect(props.navigation.goBack).not.toBeCalled();
  });

  it('should navigate back if url is not found', async () => {
    props.route.params.url = '';
    renderWithGlobalContext(<AppCommonWebView {...props} />);
    await act(async () => await wait(0));
    expect(props.navigation.goBack).toBeCalled();
  });

  it('should set title if set', async () => {
    renderWithGlobalContext(<AppCommonWebView {...props} />);
    await act(async () => await wait(0));
    expect(props.navigation.setOptions).toBeCalledWith({ title: props.route.params.title });
  });

  it('should use default title if not set', async () => {
    props.route.params.title = '';
    renderWithGlobalContext(<AppCommonWebView {...props} />);
    await act(async () => await wait(0));
    expect(props.navigation.setOptions).not.toBeCalled();
  });

  it('should show a critical error when an onHttpError is fired', async () => {
    const { queryByTestId } = renderWithGlobalContext(<AppCommonWebView {...props} />);
    expect(queryByTestId('critical-error-container')).toBeFalsy();
    await act(() => wait(0));
    fireEvent(queryByTestId('app-common-webview-webview'), 'onHttpError', { nativeEvent: { code: 401 } });
    expect(queryByTestId('critical-error-container')).toBeTruthy();
  });
});

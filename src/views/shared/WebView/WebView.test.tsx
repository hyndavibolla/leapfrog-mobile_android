import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { WebView, Props } from './WebView';
import { ENV } from '_constants';
import { wait } from '_utils/wait';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getInitialState } from '_state_mgmt/GlobalState';
import { IGlobalState } from '_models/general';

describe('CustomWebView', () => {
  let onNavigationStateChangeFN: () => void;
  let props: Props;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    onNavigationStateChangeFN = jest.fn();
    props = {
      source: { uri: 'https://test.com' },
      testID: 'webview'
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<WebView {...props} />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with a loader', async () => {
    const { toJSON } = renderWithGlobalContext(<WebView {...props} shouldShowLoader={true} />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with hideElements', async () => {
    const hideElements = ['div', '.class', '#id'];
    const { toJSON } = renderWithGlobalContext(<WebView {...props} hideElements={hideElements} />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should retry webview load on error', async () => {
    const reload = jest.fn();
    const { getByTestId } = renderWithGlobalContext(<WebView {...props} retry={{ attempts: 2, delayMs: 10 }} testID="webview-login" />);
    await act(() => wait(0));
    const webView = getByTestId('webview-login');
    expect(reload).not.toBeCalled();
    const iterations = ENV.WEBVIEWS.MAX_LOAD_ATTEMPTS + 1 /** compensating for index */ + 1; /** to test it doesn't retry more than configured */
    /** chaining events fired so they are sequential. This results in a more predictable execution timing regardless of the attempt delay ms amount */
    await Array.from(new Array(iterations)).reduce(
      total => () => total().then(() => wait(ENV.WEBVIEWS.ATTEMPT_DELAY_MS).then(async () => fireEvent(webView, 'onError', { target: { reload } }))),
      async () => undefined
    )();
    expect(reload).toBeCalledTimes(ENV.WEBVIEWS.MAX_LOAD_ATTEMPTS);
  });

  it('should fire onError callback', async () => {
    const onError = jest.fn();
    const { getByTestId } = renderWithGlobalContext(<WebView {...props} onError={onError} testID="webview-login" />);
    await act(() => wait(0));
    const webView = getByTestId('webview-login');
    fireEvent(webView, 'onError', { nativeEvent: { code: 1000 } });
    expect(onError).toBeCalledWith({ nativeEvent: { code: 1000 } });
  });

  it('should fire onHttpError callback', async () => {
    const handleHttpError = jest.fn();
    const { getByTestId } = renderWithGlobalContext(<WebView {...props} onHttpError={handleHttpError} testID="webview-login" />);
    await act(() => wait(0));
    fireEvent(getByTestId('webview-login'), 'onHttpError', { nativeEvent: { code: 401 } });
    expect(handleHttpError).toBeCalledWith({ nativeEvent: { code: 401 } });
  });

  it('should render with no internet connection', async () => {
    const { toJSON } = renderWithGlobalContext(<WebView {...props} />, undefined, { ...initialState, core: { ...initialState.core, isConnected: false } });
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with onNavigationStateChangeFN function', async () => {
    const { getByTestId } = renderWithGlobalContext(<WebView {...props} onNavigationStateChangeFN={onNavigationStateChangeFN} testID="webview-login" />);
    await act(() => wait(0));
    const webView = getByTestId('webview-login');
    expect(onNavigationStateChangeFN).not.toBeCalled();
    fireEvent(webView, 'onNavigationStateChange', undefined);
    await act(() => wait(0));
    expect(onNavigationStateChangeFN).toBeCalled();
  });

  it('should call unmountCallback function', async () => {
    const unmountCallback = jest.fn();
    const { getByTestId, unmount } = renderWithGlobalContext(
      <WebView {...props} onNavigationStateChangeFN={onNavigationStateChangeFN} testID="webview-login" unmountCallback={unmountCallback} />
    );
    expect(getByTestId('webview-login')).toBeTruthy();
    unmount();
    expect(unmountCallback).toBeCalled();
  });
});

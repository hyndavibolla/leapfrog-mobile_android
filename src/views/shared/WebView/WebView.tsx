import React, { memo, useMemo, useContext, useRef, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { WebViewErrorEvent, WebViewHttpErrorEvent, WebViewNavigation, WebViewSourceHtml, WebViewSourceUri } from 'react-native-webview/lib/WebViewTypes';
import { WebView as NativeWebView, WebViewProps } from 'react-native-webview';

import NoConnectionIcon from '_assets/shared/noConnectionOrange.svg';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { wait } from '_utils/wait';
import { styles } from './styles';
import { Spinner } from '../Spinner';
import { Text } from '../Text';
import { ENV, FONT_FAMILY } from '_constants';
import { CriticalError } from '../CriticalError';
import { noop } from '_utils/noop';
import { useTimer } from '_utils/useTimer';

export interface Props extends WebViewProps {
  shouldShowLoader?: boolean;
  hideElements?: string[];
  retry?: { attempts: number; delayMs: number };
  refreshInterval?: number;
  source: WebViewSourceUri | WebViewSourceHtml;
  onNavigationStateChangeFN?: (event: WebViewNavigation) => void;
  onHttpError?: (event: WebViewHttpErrorEvent) => void;
  unmountCallback?: () => void;
}

export const WebView = ({
  shouldShowLoader = false,
  hideElements = [],
  retry,
  onNavigationStateChangeFN,
  onHttpError,
  refreshInterval = 0,
  unmountCallback,
  ...props
}: Props) => {
  const { deps, state } = useContext(GlobalContext);
  const ref = useRef<NativeWebView>();
  const { timer } = useTimer(refreshInterval, !!refreshInterval);

  const onError = useMemo(() => {
    let numLoadAttempts = 0;
    return async (event: WebViewErrorEvent) => {
      const reload = (event.target as any)?.reload || /* istanbul ignore next */ ref?.current?.reload;
      numLoadAttempts++;
      if (retry && reload && numLoadAttempts <= retry.attempts) {
        deps.logger.warn('Error loading webview content', { numLoadAttempts, url: props.source });
        await wait(retry.delayMs);
        return reload();
      }
      /** error is final --finished retrying-- */
      deps.logger.error(`Error code "${event.nativeEvent?.code}" loading webview content`, props.source);
      if (props.onError) props.onError(event);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hideElementJS = hideElements.map(selector => `document.querySelector('${selector}').style.display = 'none';`).join('\n');
  const injectedJavaScript = [hideElementJS, props.injectedJavaScript, 'true;'].filter(Boolean).join(';');

  const renderLoading = useCallback(
    () => (
      <View style={styles.spinnerContainer}>
        <Spinner />
      </View>
    ),
    []
  );

  const renderError = useCallback(
    /* istanbul ignore next */ () => (
      <View style={styles.spinnerContainer}>
        <CriticalError />
      </View>
    ),
    []
  );

  const onLoad = useCallback(
    /* istanbul ignore next */ event => {
      event && ref.current.injectJavaScript('window.scrollTo(0, 0);');
      if (typeof props.onLoad === 'function') props.onLoad(event);
    },
    [props]
  );

  useEffect(() => {
    /* istanbul ignore next */ if (refreshInterval && !ENV.IS_TEST) ref?.current?.reload && ref.current.reload();
  }, [timer]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    deps.logger.info('Loading webview', { source: props.source });
  }, [props.source, deps.logger]);

  useEffect(() => {
    return () => {
      if (typeof unmountCallback !== 'undefined') unmountCallback();
    };
  }, [unmountCallback]);

  return state.core.isConnected ? (
    <NativeWebView
      {...props}
      ref={ref}
      startInLoadingState={!!shouldShowLoader}
      renderLoading={shouldShowLoader ? renderLoading : undefined}
      injectedJavaScript={injectedJavaScript}
      javaScriptEnabled={true}
      onError={onError}
      renderError={renderError}
      onLoad={onLoad}
      onNavigationStateChange={onNavigationStateChangeFN}
      sharedCookiesEnabled={true}
      thirdPartyCookiesEnabled={true}
      useSharedProcessPool={true}
      setSupportMultipleWindows={false}
      onMessage={props.onMessage || noop}
      onHttpError={onHttpError}
    />
  ) : (
    <View style={styles.container}>
      <NoConnectionIcon />
      <View style={styles.textContainer}>
        <Text font={FONT_FAMILY.BOLD} style={styles.title}>
          Whoops!
        </Text>
        <Text font={FONT_FAMILY.BOLD} style={styles.title}>
          You don't have an internet connection
        </Text>
        <Text style={styles.text}>Check your internet settings and try again.</Text>
      </View>
    </View>
  );
};

export default memo(WebView);

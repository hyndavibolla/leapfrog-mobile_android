import React, { memo, useState, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

import { ConnectionBanner } from '_components/ConnectionBanner';
import { CriticalError } from '_components/CriticalError';
import { WebView } from '_components/WebView';
import { ENV } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';

export interface Props {
  navigation: StackNavigationProp<any>;
  route: { params: { title?: string; url: string } };
}

const { MAX_LOAD_ATTEMPTS: maxLoadAttempts, ATTEMPT_DELAY_MS: attemptDelay } = ENV.WEBVIEWS;

export const AppCommonWebView = ({ navigation, route }: Props) => {
  const [isHttpError, setIsHttpError] = useState(false);
  const { title, url } = route.params;

  const { getTestIdProps } = useTestingHelper('app-common-webview');

  useEffect(() => {
    if (!url) {
      navigation.goBack();
      return;
    }
    if (title) navigation.setOptions({ title });
  }, [navigation, title, url]);

  return (
    <>
      <ConnectionBanner />
      {isHttpError ? (
        <CriticalError />
      ) : (
        <WebView
          {...getTestIdProps('webview')}
          shouldShowLoader
          source={{ uri: url }}
          retry={{ attempts: maxLoadAttempts, delayMs: attemptDelay }}
          onHttpError={() => {
            setIsHttpError(true);
          }}
        />
      )}
    </>
  );
};

export default memo(AppCommonWebView);

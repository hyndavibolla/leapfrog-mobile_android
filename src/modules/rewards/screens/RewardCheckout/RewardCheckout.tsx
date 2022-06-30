import React, { memo, useEffect, useContext, useCallback, useState, useMemo } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { WebViewNativeEvent } from 'react-native-webview/lib/WebViewTypes';

import { WebView } from '_components/WebView/WebView';
import { ConnectionBanner } from '_components/ConnectionBanner';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useCheckoutUrl } from '_state_mgmt/reward/hooks';
import { useLogout } from '_state_mgmt/auth/hooks';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useAsyncCallback } from '_utils/useAsyncCallback';

import { ENV, ROUTES } from '_constants';

export interface Props {
  route?: {
    params?: {
      brandId?: string;
      brandName?: string;
      cardValue?: number;
      brandLogo?: string;
      points?: number;
    };
  };
  navigation: StackNavigationProp<any>;
}

interface ForterHeaders {
  accessToken: string;
  clientid: string;
}

export const RewardCheckout = ({
  route: {
    params: { brandId, brandName, cardValue, brandLogo, points }
  },
  navigation
}: Props) => {
  const { deps } = useContext(GlobalContext);
  const { MAX_LOAD_ATTEMPTS: maxLoadAttempts, ATTEMPT_DELAY_MS: attemptDelay } = ENV.WEBVIEWS;
  const { CHECKOUT_CLIENT_HEADER: checkoutClientHeader, FINISHED_URI_PREFIXES: finishedUriPrefixes } = ENV.API.SLIDE;
  const [getCheckoutUrl, , , checkoutUrl] = useCheckoutUrl(brandId, cardValue, brandName, brandLogo, points);
  const { getTestIdProps } = useTestingHelper('slide-viewer');
  const [logout] = useLogout();
  const [getToken, isLoadingToken, , token] = useAsyncCallback(deps.apiService.getTokenSetAsync, []);
  const [forterHeaders, setForterHeaders] = useState<ForterHeaders>({
    accessToken: '',
    clientid: ENV.AUTH0.CLIENT_ID
  });
  const [currentURI, setCurrentURI] = useState<string>(ENV.FORTER_API.FRAUD_PREVENTION_URL);

  const currentHeaders = useMemo(
    () => (currentURI === ENV.FORTER_API.FRAUD_PREVENTION_URL ? forterHeaders : { Client: checkoutClientHeader, 'onetrust-mask': 'true' }),
    [currentURI, forterHeaders, checkoutClientHeader]
  );

  useEffect(() => {
    getCheckoutUrl();
    getToken();
  }, [getCheckoutUrl, getToken]);

  useEffect(() => {
    if (token) setForterHeaders(headers => ({ ...headers, accessToken: token.accessToken }));
  }, [token]);

  const onNavigationStateChange = useCallback(
    async (event: WebViewNativeEvent) => {
      deps.logger.debug('onNavigationStateChange', { url: event.url });
      if (new RegExp(ENV.FORTER_API.ALLOWED_ACCESS_URL_REGEX).test(event.url)) setCurrentURI(checkoutUrl);
      if (new RegExp(ENV.FORTER_API.DENIED_ACCESS_URL_REGEX).test(event.url)) {
        setCurrentURI('');
        await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.FORCED_TO_LOGOUT, true);
        logout();
      }
      const needToReturn = finishedUriPrefixes.split('|').some(p => event.url.startsWith(p));
      deps.logger.debug(`URL ${needToReturn ? 'is' : 'is not'} a returning URL from Slide.`);

      if (needToReturn) {
        navigation.navigate(ROUTES.MAIN_TAB.REWARDS);
      }
    },
    [deps.logger, navigation, finishedUriPrefixes, checkoutUrl, logout, deps.nativeHelperService.storage]
  );

  return (
    <>
      <ConnectionBanner />
      {!checkoutUrl || isLoadingToken ? null : (
        <WebView
          shouldShowLoader={true}
          onNavigationStateChangeFN={onNavigationStateChange}
          source={{ uri: currentURI, headers: currentHeaders }}
          retry={{ attempts: maxLoadAttempts, delayMs: attemptDelay }}
          {...getTestIdProps('webview')}
        />
      )}
    </>
  );
};

export default memo(RewardCheckout);

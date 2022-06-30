import React, { memo, useCallback, useContext, useEffect, useMemo } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { WebViewNavigation } from 'react-native-webview';

import { WebView } from '../shared/WebView/WebView';
import { ConnectionBanner } from '../shared/ConnectionBanner';

import { GlobalContext } from '../../state-mgmt/GlobalState';
import { useRegisterFusionIntegrationResult } from '../../state-mgmt/core/hooks';
import { useTestingHelper } from '../../utils/useTestingHelper';
import { useEventTracker } from '../../state-mgmt/core/hooks';
import { useAsyncCallback } from '../../utils/useAsyncCallback';
import { useSid } from '../../utils/useSid';

import { ENV, ForterActionType, PageType, ROUTES, TealiumEventType } from '../../constants';
import { ITokenSet } from '../../models/general';

export interface Props {
  navigation: StackNavigationProp<any>;
  route?: { params?: { routeToReturn?: string } };
}

export const FusionViewer = ({ navigation, route }: Props) => {
  const { deps } = useContext(GlobalContext);

  const { APPLY_NOW_URI: applyNowWebviewUri } = ENV.FUSION;
  const { MAX_LOAD_ATTEMPTS: maxLoadAttempts, ATTEMPT_DELAY_MS: attemptDelay } = ENV.WEBVIEWS;
  const { FINISHED_URI_REGEX } = ENV.FUSION;
  const [registerFusion] = useRegisterFusionIntegrationResult();
  const { getTestIdProps } = useTestingHelper('fusion-viewer');
  const { trackUserEvent } = useEventTracker();
  const [getStoredSid, isLoadingSid, , sid] = useSid();

  const parsedSid = useMemo(() => (sid ? `&sid=${sid}` : ''), [sid]);

  const returnToApp = useCallback(
    (resultCode, data) => {
      trackUserEvent(
        TealiumEventType.CARD_APPLICATION_COMPLETE,
        {
          page_type: PageType.TOP,
          iframe: data.url,
          event_type: resultCode
        },
        ForterActionType.TAP
      );
      registerFusion(resultCode);
      const routeToReturn = route?.params?.routeToReturn;
      if (routeToReturn) navigation.navigate(routeToReturn, { finishedURI: true });
      else navigation.navigate(ROUTES.MAIN);
    },
    [registerFusion, navigation, trackUserEvent, route?.params?.routeToReturn]
  );

  const onNavigationStateChange = useCallback(
    async (event: WebViewNavigation) => {
      deps.logger.debug('onNavigationStateChange', { url: event.url });

      const isInitialUrl = event.url === applyNowWebviewUri;
      const matchesReturnRegex = new RegExp(FINISHED_URI_REGEX).test(event.url);
      const needsToReturn = matchesReturnRegex && !isInitialUrl;

      deps.logger.debug(`URL ${needsToReturn ? 'is' : 'is not'} a returning URL from Fusion.`);
      if (needsToReturn) {
        deps.logger.info(`URL ${event.url} a returning URL. Returning to app.`);
        const pattern = /fromCiti=(\w)/;
        const match = pattern.exec(event.url);
        const resultCode = (match && match[1]) || '';
        returnToApp(resultCode, { url: event.url });
      }
    },
    [FINISHED_URI_REGEX, applyNowWebviewUri, deps.logger, returnToApp]
  );

  const [getTokenSet, isGettingToken = true, , tokenSet] = useAsyncCallback<any, ITokenSet>(async () => {
    return await deps.apiService.getTokenSetAsync();
  }, []);

  useEffect(() => {
    getTokenSet();
    getStoredSid();
  }, [getTokenSet, getStoredSid]);

  // cSpell:ignore accesstoken
  return (
    <>
      <ConnectionBanner />
      {isGettingToken || isLoadingSid ? null : (
        <WebView
          {...getTestIdProps('webview')}
          shouldShowLoader={true}
          source={{ uri: `${applyNowWebviewUri}${parsedSid}&intcmp=iMAXxWallet`, headers: { 'onetrust-mask': 'true', accesstoken: tokenSet?.accessToken } }}
          retry={{ attempts: maxLoadAttempts, delayMs: attemptDelay }}
          onNavigationStateChangeFN={onNavigationStateChange}
        />
      )}
    </>
  );
};

export default memo(FusionViewer);

import React, { memo, useMemo, useContext, useEffect } from 'react';

import { ENV } from '_constants';
import { WebView } from '_components/WebView';
import { ConnectionBanner } from '_views/shared/ConnectionBanner';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useAsyncCallback } from '_utils/useAsyncCallback';
import { ITokenSet } from '_models/general';
import { GlobalContext } from '_state_mgmt/GlobalState';

export interface Props {
  route: { params: { uri: string } };
}

export const EditProfile = ({ route }: Props) => {
  const { getTestIdProps } = useTestingHelper('edit-profile');

  const { deps } = useContext(GlobalContext);
  const { MAX_LOAD_ATTEMPTS: maxLoadAttempts, ATTEMPT_DELAY_MS: attemptDelay } = ENV.WEBVIEWS;
  const [getTokenSet, isGettingToken = true, , tokenSet] = useAsyncCallback<any, ITokenSet>(async () => {
    return await deps.apiService.getTokenSetAsync();
  }, []);
  const uri = route?.params?.uri;
  const retry = useMemo(() => ({ attempts: maxLoadAttempts, delayMs: attemptDelay }), [attemptDelay, maxLoadAttempts]);

  useEffect(() => {
    getTokenSet();
  }, [getTokenSet]);

  return (
    <>
      <ConnectionBanner />
      {isGettingToken ? null : (
        <WebView
          {...getTestIdProps('webview')}
          shouldShowLoader={true}
          source={{ uri, headers: { 'onetrust-mask': 'true', accessToken: tokenSet?.accessToken } }}
          retry={retry}
        />
      )}
    </>
  );
};

export default memo(EditProfile);

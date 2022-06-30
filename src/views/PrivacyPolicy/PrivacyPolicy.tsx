import React, { useContext, useEffect, useMemo } from 'react';
import { View } from 'react-native';

import { GlobalContext } from '_state_mgmt/GlobalState';

import { ConnectionBanner } from '_components/ConnectionBanner';
import { Spinner } from '_components/Spinner';
import { CriticalError } from '_components/CriticalError';
import { WebView } from '_components/WebView';

import { useAsyncCallback } from '_utils/useAsyncCallback';
import { useTestingHelper } from '_utils/useTestingHelper';

import { getWrappedHtml } from '_utils/getWrappedStaticHtml';

import { styles } from './styles';

function PrivacyPolicy() {
  const { getTestIdProps } = useTestingHelper('privacy-policy');
  const { deps } = useContext(GlobalContext);

  const [onGetStaticHtml, isGetStaticHtmlLoading = true, error, staticHtml] = useAsyncCallback(async () => {
    /** @todo move into a setting */
    const url = 'https://www.shopyourway.com/secured/-/m/static-content?type=PrivacyPolicy';
    return await deps.httpService.fetch(url, { method: 'GET' }).then(r => {
      return r.text();
    });
  }, []);

  useEffect(() => {
    onGetStaticHtml();
  }, [onGetStaticHtml]);

  const html = useMemo(() => getWrappedHtml(staticHtml), [staticHtml]);

  return (
    <>
      <ConnectionBanner />
      {!isGetStaticHtmlLoading ? null : (
        <View style={styles.spinnerContainer} {...getTestIdProps('spinner')}>
          <Spinner />
        </View>
      )}
      {!error ? null : <CriticalError />}
      {!staticHtml ? null : <WebView source={{ html }} {...getTestIdProps('webview')} />}
    </>
  );
}

export default PrivacyPolicy;

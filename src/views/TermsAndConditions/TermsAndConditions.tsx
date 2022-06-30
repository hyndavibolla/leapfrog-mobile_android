import React, { memo, useContext, useEffect, useMemo } from 'react';
import { View } from 'react-native';

import { WebView } from '../shared/WebView';
import { ConnectionBanner } from '../shared/ConnectionBanner';
import { Spinner } from '../shared/Spinner';
import { styles } from './styles';
import { GlobalContext } from '../../state-mgmt/GlobalState';
import { useAsyncCallback } from '../../utils/useAsyncCallback';
import { getWrappedHtml } from '../../utils/getWrappedStaticHtml';
import { CriticalError } from '../shared/CriticalError/CriticalError';
import { useTestingHelper } from '../../utils/useTestingHelper';

export const TermsAndConditions = () => {
  const { getTestIdProps } = useTestingHelper('terms-and-conditions');
  const { deps } = useContext(GlobalContext);
  const [onGetStaticHtml, isGetStaticHtmlLoading = true, error, staticHtml] = useAsyncCallback(async () => {
    const url = 'https://www.shopyourway.com/secured/-/m/static-content?type=TermsOfService';
    return await deps.httpService.fetch(url, { method: 'GET' }).then(r => r.text());
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
      {!staticHtml ? null : <WebView source={{ html }} />}
    </>
  );
};

export default memo(TermsAndConditions);

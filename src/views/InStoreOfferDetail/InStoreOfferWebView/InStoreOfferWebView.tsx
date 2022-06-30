import React, { memo, useState, useMemo } from 'react';

import { ENV } from '../../../constants';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { WebView } from '../../shared/WebView/WebView';
import { ConnectionBanner } from '../../shared/ConnectionBanner';
import { FallbackOffers } from '../../InStoreOffersSearchMap/components/FallbackOffers';
import LocationErrorIcon from '../../../assets/in-store-offer/locationError.svg';

const { MAX_LOAD_ATTEMPTS: maxLoadAttempts, ATTEMPT_DELAY_MS: attemptDelay } = ENV.WEBVIEWS;

export interface Props {
  route: { params: { uri: string } };
}

export const InStoreOfferWebView = ({
  route: {
    params: { uri }
  }
}: Props) => {
  const { getTestIdProps } = useTestingHelper('in-store-offer-detail');
  const [isHttpError, setIsHttpError] = useState(false);
  const source = useMemo(() => ({ uri }), [uri]);

  if (isHttpError) {
    return (
      <FallbackOffers
        icon={<LocationErrorIcon width={80} height={80} />}
        description="Whoops! Something went wrong"
        note="It looks like we can't connect with the site. Please try again later."
      />
    );
  }

  return (
    <>
      <ConnectionBanner />
      <WebView
        {...getTestIdProps('webview')}
        shouldShowLoader
        source={source}
        retry={{ attempts: maxLoadAttempts, delayMs: attemptDelay }}
        onHttpError={() => setIsHttpError(true)}
      />
    </>
  );
};

export default memo(InStoreOfferWebView);

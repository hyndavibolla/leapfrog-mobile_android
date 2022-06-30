import React, { memo } from 'react';

import { WebView } from '_components/WebView';
import { useTestingHelper } from '_utils/useTestingHelper';
import { ENV } from '_constants';

export interface Props {
  route: { params: { apiGoogleUrl: string } };
}

export const GiftCardGooglePay = ({
  route: {
    params: { apiGoogleUrl }
  }
}: Props) => {
  const { getTestIdProps } = useTestingHelper('gift-card-google-pay');
  const { MAX_LOAD_ATTEMPTS: maxLoadAttempts, ATTEMPT_DELAY_MS: attemptDelay } = ENV.WEBVIEWS;

  return (
    <WebView {...getTestIdProps('webview')} retry={{ attempts: maxLoadAttempts, delayMs: attemptDelay }} shouldShowLoader source={{ uri: apiGoogleUrl }} />
  );
};

export default memo(GiftCardGooglePay);

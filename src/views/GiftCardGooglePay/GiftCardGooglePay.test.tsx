import React from 'react';

import { Deps } from '_models/general';
import { GiftCardGooglePay, Props } from './GiftCardGooglePay';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

describe('GiftCard Google Pay', () => {
  let deps: Deps;
  let props: Props;

  beforeEach(() => {
    deps = getMockDeps();
    props = {
      route: { params: { apiGoogleUrl: 'https://example.com' } }
    };
  });

  it('should render', () => {
    const { getByTestId } = renderWithGlobalContext(<GiftCardGooglePay {...props} />, deps);
    expect(getByTestId('gift-card-google-pay-webview')).toBeTruthy();
  });
});

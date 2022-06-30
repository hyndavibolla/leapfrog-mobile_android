import React from 'react';
import { render } from '@testing-library/react-native';

import { InStoreOfferTermsConditions } from '.';

describe('In-Store Offer Detail Terms and Conditions', () => {
  it('should render when offer is active', () => {
    const { getByTestId } = render(<InStoreOfferTermsConditions isActive />);
    expect(getByTestId('in-store-offer-conditions-how-it-works-active')).toBeTruthy();
  });

  it('should render when offer is inactive', () => {
    const { queryByTestId } = render(<InStoreOfferTermsConditions isActive={false} />);
    expect(queryByTestId('in-store-offer-conditions-how-it-works-active')).toBeNull();
  });
});

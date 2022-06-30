import React from 'react';
import { render } from '@testing-library/react-native';

import { InStoreOfferDetailHeading } from '.';
import { Props } from './InStoreOfferDetailHeading';

describe('In-Store Offer Detail', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      isActive: false,
      activeUntil: new Date(),
      name: '',
      rewardText: 'test'
    };
  });

  it('should render', () => {
    const { getByTestId } = render(<InStoreOfferDetailHeading {...props} />);
    expect(getByTestId('in-store-offer-heading-container')).toBeTruthy();
  });
});

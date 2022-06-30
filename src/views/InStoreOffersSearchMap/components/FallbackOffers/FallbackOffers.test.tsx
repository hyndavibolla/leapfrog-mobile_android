import React from 'react';

import FallbackOffers, { Props } from './FallbackOffers';

import { renderWithGlobalContext } from '../../../../test-utils/renderWithGlobalContext';

import CreditCardFallbackIcon from '../../../../assets/in-store-offer/creditCardFallback.svg';

describe('Fallback in-store Offers on Map', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      icon: <CreditCardFallbackIcon />,
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
      note: "Lorem Ipsum has been the industry's standard dummy text"
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<FallbackOffers {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

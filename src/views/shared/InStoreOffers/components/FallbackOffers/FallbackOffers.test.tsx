import React from 'react';

import FallbackOffers, { Props } from './FallbackOffers';

import { renderWithGlobalContext } from '../../../../../test-utils/renderWithGlobalContext';

import CardFallbackIcon from '../../../../../assets/in-store-offer/cardFallback.svg';

describe('Fallback In Store Offers', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      icon: <CardFallbackIcon />,
      description: 'lorem ipsum',
      note: 'lorem ipsum'
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<FallbackOffers {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

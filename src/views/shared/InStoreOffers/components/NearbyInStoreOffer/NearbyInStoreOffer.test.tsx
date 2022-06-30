import React from 'react';
import { act } from 'react-test-renderer';

import NearbyInStoreOffer, { Props } from './NearbyInStoreOffer';

import { renderWithGlobalContext } from '../../../../../test-utils/renderWithGlobalContext';
import { getLocalOffers_2 } from '../../../../../test-utils/entities';
import { wait } from '../../../../../utils/wait';

describe('Nearby In Store Offer', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      offer: getLocalOffers_2().offers[0],
      disabled: false,
      showStreet: true,
      onPress: jest.fn()
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<NearbyInStoreOffer {...props} />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });
});

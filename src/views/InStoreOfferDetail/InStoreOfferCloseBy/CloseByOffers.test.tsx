import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';

import { CloseByOffers } from '.';
import { Props } from './CloseByOffers';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { getInitialState } from '../../../state-mgmt/GlobalState';
import { getMockDeps } from '../../../test-utils/getMockDeps';
import { Deps, IGlobalState } from '../../../models/general';
import { wait } from '../../../utils/wait';
import { getCardLinkOffer_1, getLocalOffers_3 } from '../../../test-utils/entities';
import { ROUTES } from '../../../constants';

const dayInMSecs = 1000 * 60 * 60 * 24;

describe('Close By Offers', () => {
  let state: IGlobalState;
  let deps: Deps;
  let props: Props;

  beforeEach(() => {
    state = getInitialState();
    state.cardLink.offers = [getCardLinkOffer_1()];
    deps = getMockDeps();
    props = {
      offerId: getCardLinkOffer_1().offerId,
      navigation: { push: jest.fn() } as any
    };
  });

  it('should render the component and title correctly', async () => {
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_3());
    const { toJSON, queryByTestId, queryAllByTestId } = renderWithGlobalContext(<CloseByOffers {...props} />, deps, state);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
    expect(queryByTestId('in-store-offer-close-by-title')).toBeTruthy();
    expect(queryAllByTestId('nearby-in-store-offer-offer').length).toBe(4);
    fireEvent.press(queryByTestId('in-store-offer-close-by-web-url'));
    await act(() => wait(0));
    expect(props.navigation.push).toBeCalledWith(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP, { selectedOfferId: props.offerId });
  });

  it('should not render the title or offers', async () => {
    const { toJSON, queryByTestId, queryAllByTestId } = renderWithGlobalContext(<CloseByOffers {...props} />, deps, state);
    await act(() => wait(0));
    expect(toJSON()).toBe(null);
    expect(queryByTestId('in-store-offer-close-by-title')).toBeFalsy();
    expect(queryAllByTestId('nearby-in-store-offer-offer').length).toBe(0);
  });

  it('should render close by offers with activated status', async () => {
    const getOffersResponse = getLocalOffers_3();
    getOffersResponse.offers[1].activeUntil = Date.now() + dayInMSecs;
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getOffersResponse);
    const { toJSON } = renderWithGlobalContext(<CloseByOffers {...props} />, deps, state);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should go to map screen when press on an offer', async () => {
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_3());
    const { queryAllByTestId } = renderWithGlobalContext(<CloseByOffers {...props} />, deps, state);
    await act(() => wait(0));
    fireEvent.press(queryAllByTestId('nearby-in-store-offer-item')[0]);
    await act(() => wait(0));
    const maxOffers = 4;
    const offers = getLocalOffers_3()
      ?.offers?.filter(({ offerId }) => offerId !== props.offerId)
      ?.slice(0, maxOffers);
    expect(props.navigation.push).toBeCalledWith(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP, {
      selectedOfferId: offers[0].offerId,
      focusOnSelectedOffer: true
    });
  });
});

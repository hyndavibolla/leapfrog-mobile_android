import React from 'react';
import { act } from 'react-test-renderer';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getInitialState } from '_state_mgmt/GlobalState';
import { IGlobalState } from '_models/general';
import { GeneralModel } from '_models';
import { getMockDeps } from '_test_utils/getMockDeps';
import { getLocalOffers_2 } from '_test_utils/entities';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { wait } from '_utils/wait';
import { ROUTES } from '_constants/routes';

import InStoreOfferList, { Props } from './InStoreOfferList';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('InStoreOfferList', () => {
  let props: Props;
  let initialState: IGlobalState;
  let deps: GeneralModel.Deps;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    props = {
      hasLinkedCards: true,
      buildItemStyle: () => {
        return {};
      },
      onOfferSelected: jest.fn()
    };
  });

  it('should render', async () => {
    initialState.cardLink.offers = getLocalOffers_2().offers;
    const { toJSON } = renderWithGlobalContext(<InStoreOfferList {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should activate an offer', async () => {
    initialState.cardLink.offers = [getLocalOffers_2().offers[0]];
    const { toJSON, getByTestId } = renderWithGlobalContext(<InStoreOfferList {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId(`in-store-offer-button`));
    await act(() => wait(0));
    expect(deps.apiService.activateLocalOffer).toBeCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should select an offer', async () => {
    initialState.cardLink.offers = [getLocalOffers_2().offers[0]];
    props.allowNavigation = false;
    const { getByTestId } = renderWithGlobalContext(<InStoreOfferList {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId(`nearby-in-store-offer-item`));
    await act(() => wait(0));
    expect(props.onOfferSelected).toBeCalledWith(getLocalOffers_2().offers[0], 0);
  });

  it('should not activate offer when user does not have linked cards', async () => {
    initialState.cardLink.offers = [getLocalOffers_2().offers[0]];
    props.hasLinkedCards = false;
    const { toJSON, getByTestId } = renderWithGlobalContext(<InStoreOfferList {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId(`in-store-offer-button`));
    await act(() => wait(0));
    expect(deps.apiService.activateLocalOffer).not.toBeCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not activate offer when offer is not valid', async () => {
    const offer = getLocalOffers_2().offers[0];
    offer.validUntil = offer.validFrom;
    initialState.cardLink.offers = [offer];
    const { toJSON, getByTestId } = renderWithGlobalContext(<InStoreOfferList {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId(`in-store-offer-button`));
    await act(() => wait(0));
    expect(deps.apiService.activateLocalOffer).not.toBeCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should try activate offer when api fails', async () => {
    initialState.cardLink.offers = [getLocalOffers_2().offers[0]];
    deps.apiService.activateLocalOffer = jest.fn(() => {
      throw new Error();
    });
    const { toJSON, getByTestId } = renderWithGlobalContext(<InStoreOfferList {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId(`in-store-offer-button`));
    await act(() => wait(0));
    expect(deps.apiService.activateLocalOffer).toBeCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should activate an offer when routeToActivateLocalOffer is set', async () => {
    initialState.cardLink.offers = [getLocalOffers_2().offers[0]];
    initialState.cardLink.routeToActivateLocalOffer = ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP;
    const { getByTestId } = renderWithGlobalContext(<InStoreOfferList {...props} />, deps, initialState);

    await waitFor(() => {
      fireEvent.press(getByTestId(`in-store-offer-button`));
      expect(deps.apiService.activateLocalOffer).toBeCalledWith(initialState.cardLink.offers[0].offerId);
    });
  });
});

import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import navigation from '@react-navigation/native';
const {
  RESULTS: { GRANTED }
} = require('react-native-permissions/mock');

import LocalOffersSection, { Props } from './LocalOffersSection';

import { getInitialState } from '_state_mgmt/GlobalState';
import { Deps, IGlobalState } from '_models/general';
import { TransactionFilter } from '_models/offer';
import { LocationType } from '_models/cardLink';

import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getLocalOffers_1, getLocalOffers_4 } from '_test_utils/entities';

import { wait } from '_utils/wait';
import { ROUTES } from '_constants';

const position = {
  coords: {
    latitude: 57.7,
    longitude: 11.93
  }
};

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return { useNavigation: () => ({ navigate: mockedNavigate }) };
});

describe('Local Offer Section', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    navigation.useIsFocused = jest.fn(() => true);
    props = {
      transactionType: TransactionFilter.ALL_TRANSACTIONS
    };
    deps = getMockDeps();
    initialState = getInitialState();
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<LocalOffersSection {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render offers when there is a zip available', async () => {
    initialState.user.currentUser.personal.currentLocation.zip = '33101';

    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(GRANTED);
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockReturnValueOnce(getLocalOffers_4());

    renderWithGlobalContext(<LocalOffersSection {...props} />, deps, initialState);
    await act(() => wait(0));

    expect(deps.nativeHelperService.geolocation.getCurrentPosition).not.toBeCalled();
    expect(deps.apiService.fetchLocalOffers).toBeCalled();
  });

  it('should navigate to in store offers search map when the first gift card of the list is pressed and the location is available', async () => {
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(GRANTED);
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockReturnValueOnce(getLocalOffers_1());

    const { getAllByTestId } = renderWithGlobalContext(<LocalOffersSection {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('local-offers-section-offer')[0]);
    await act(() => wait(0));
    expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP, {
      locationType: LocationType.OFFER,
      searchedValue: getLocalOffers_1().offers[0].brandName
    });
  });

  it('should render nothing when offers list is empty', async () => {
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(GRANTED);
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockRejectedValueOnce('error');

    const { queryAllByTestId } = renderWithGlobalContext(<LocalOffersSection {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(queryAllByTestId('local-offers-section-offer')[0]).toBeFalsy();
  });

  it('should not fetch gift cards when the component is not focused', async () => {
    navigation.useIsFocused = jest.fn(() => false);
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(GRANTED);
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockReturnValueOnce(getLocalOffers_1());

    renderWithGlobalContext(<LocalOffersSection {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(deps.apiService.fetchLocalOffers).not.toBeCalled();
  });
});

import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { ROUTES } from '../../constants';
import { Deps, IGlobalState } from '../../models/general';
import { getInitialState } from '../../state-mgmt/GlobalState';
import { getGeocodePlace, getGeocodePlaceDetails, getLocalOffers_2, getStorageRecentSearch_1, getStorageRecentSearch_2 } from '../../test-utils/entities';
import { getMockDeps } from '../../test-utils/getMockDeps';
import { renderWithGlobalContext } from '../../test-utils/renderWithGlobalContext';
import { wait } from '../../utils/wait';

import MapSearch, { Props } from './MapSearch';

const position = {
  coords: {
    latitude: 57.7,
    longitude: 11.93
  }
};

describe('MapSearch', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    props = {
      navigation: { navigate: jest.fn(), setParams: jest.fn() } as any,
      route: { params: {} }
    };
    deps = getMockDeps();
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with an existing zip code', async () => {
    initialState.cardLink.offers = getLocalOffers_2().offers;
    initialState.user.currentUser.personal.currentLocation = { zip: 33101, latitude: position.coords.latitude, longitude: position.coords.longitude };

    const { queryByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);

    await act(() => wait(0));
    expect(queryByTestId('nearby-in-store-offer-item')).toBeTruthy();
  });

  it('should render search and show fallback when no value is matched', async () => {
    deps.nativeHelperService.dimensions.getWindowWidth = jest.fn().mockReturnValueOnce(320);
    deps.nativeHelperService.geolocation.getCurrentPosition = jest.fn().mockResolvedValue(null);
    const search = 'anything';
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.changeText(getByTestId('search-input-input'), search);
    await act(() => wait(0));
    expect(queryByTestId('fallback-offers-map-container')).toBeTruthy();
  });

  it('should not search when currentLocation is not available', async () => {
    deps.nativeHelperService.dimensions.getWindowWidth = jest.fn().mockReturnValueOnce(320);
    deps.nativeHelperService.geolocation.getCurrentPosition = jest.fn().mockReturnValue(null);
    deps.apiService.fetchLocalOffers = jest.fn();
    deps.apiService.fetchPlaceAutocomplete = jest.fn();
    const search = 'anything';
    const { getByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.changeText(getByTestId('search-input-input'), search);
    await act(() => wait(0));
    expect(deps.apiService.fetchLocalOffers).not.toBeCalled();
    expect(deps.apiService.fetchPlaceAutocomplete).not.toBeCalled();
  });

  it('should press a nearby-in-store-offer-item', async () => {
    initialState.cardLink.offers = getLocalOffers_2().offers;
    const { getAllByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('nearby-in-store-offer-item')[0]);
    await act(() => wait(0));
    expect(deps.nativeHelperService.storage.set).toBeCalled();
  });

  it('should search and press a item address', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchPlaceAutocomplete = jest.fn().mockResolvedValue(getGeocodePlace());
    deps.apiService.fetchPlaceDetails = jest.fn().mockResolvedValue(getGeocodePlaceDetails());
    deps.apiService.fetchLocalOffers = jest.fn();
    const search = 'anything';
    const { getByTestId, getAllByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.changeText(getByTestId('search-input-input'), search);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('map-search-item-address')[0]);
    await act(() => wait(0));
    expect(deps.nativeHelperService.storage.set).toBeCalled();
  });

  it('should render in bold the match search text', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchPlaceAutocomplete = jest.fn().mockResolvedValue(getGeocodePlace());
    deps.apiService.fetchPlaceDetails = jest.fn().mockResolvedValue(getGeocodePlaceDetails());
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(null);
    const search = 'Chi';
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.changeText(getByTestId('search-input-input'), search);
    await act(() => wait(0));
    expect(queryByTestId('map-search-item-address-bold')).toBeTruthy();
  });

  it('should not render in bold the match search text', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchPlaceAutocomplete = jest.fn().mockResolvedValueOnce(getGeocodePlace());
    deps.apiService.fetchPlaceDetails = jest.fn().mockResolvedValueOnce(getGeocodePlaceDetails());
    deps.apiService.fetchLocalOffers = jest.fn();
    const search = 'random';
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.changeText(getByTestId('search-input-input'), search);
    await act(() => wait(0));
    expect(queryByTestId('map-search-item-address-bold')).toBeFalsy();
  });

  it('should go back on button press', async () => {
    const { getByTestId } = renderWithGlobalContext(<MapSearch {...props} />);
    await act(() => wait(0));
    fireEvent.press(getByTestId('map-search-back'));
    await act(() => wait(0));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP, { searchedValue: '', useLastLocation: false, location: null });
  });

  it('should not perform search if term is shorter than limit', async () => {
    deps.apiService.fetchPlaceAutocomplete = jest.fn();
    const search = 'an';
    const { getByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps);
    await act(() => wait(0));
    fireEvent.changeText(getByTestId('search-input-input'), search);
    expect(deps.apiService.fetchPlaceAutocomplete).not.toBeCalled();
  });

  it('should not search the previous value if empty', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    props.route.params.searchedValue = '';
    renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(props.navigation.setParams).not.toBeCalledWith();
  });

  it('should show and press an address recent search', async () => {
    deps.nativeHelperService.storage.get = async () => [getStorageRecentSearch_1()] as any;
    deps.apiService.fetchPlaceDetails = jest.fn().mockResolvedValue(getGeocodePlaceDetails());
    const { getAllByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('map-search-recent-search-item')[0]);
    await act(() => wait(0));
    expect(deps.nativeHelperService.storage.set).toBeCalled();
  });

  it('should show and press an offer recent search', async () => {
    deps.nativeHelperService.storage.get = async () => [getStorageRecentSearch_2()] as any;
    const { getAllByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('map-search-recent-search-item')[0]);
    await act(() => wait(0));
    expect(deps.nativeHelperService.storage.set).toBeCalled();
  });

  it('should show and press a location recent search', async () => {
    deps.nativeHelperService.storage.get = async () => [getStorageRecentSearch_1()] as any;
    deps.apiService.fetchPlaceDetails = jest.fn().mockResolvedValue(getGeocodePlaceDetails());
    const { getAllByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('map-search-recent-search-item')[0]);
    await act(() => wait(0));
    expect(deps.nativeHelperService.storage.set).toBeCalled();
  });

  it('should display close icon when typing and clear text when pressed', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchPlaceAutocomplete = jest.fn().mockResolvedValue(getGeocodePlace());
    deps.apiService.fetchPlaceDetails = jest.fn().mockResolvedValue(getGeocodePlaceDetails());
    deps.apiService.fetchLocalOffers = jest.fn();
    const search = 'anything';
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.changeText(getByTestId('search-input-input'), search);
    await act(() => wait(0));
    expect(queryByTestId('map-search-close')).toBeTruthy();
    fireEvent.press(queryByTestId('map-search-close'));
    await act(() => wait(0));
    expect(queryByTestId('map-search-close')).toBeFalsy();
  });

  it('should still close if there are no place suggestions', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchPlaceAutocomplete = jest.fn().mockResolvedValue(null);
    deps.apiService.fetchPlaceDetails = jest.fn().mockResolvedValue(null);
    deps.apiService.fetchLocalOffers = jest.fn();

    const search = 'anything';
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<MapSearch {...props} />, deps, initialState);

    await waitFor(() => {
      fireEvent.changeText(getByTestId('search-input-input'), search);
      expect(queryByTestId('map-search-close')).toBeTruthy();
      fireEvent.press(queryByTestId('map-search-close'));
      expect(queryByTestId('map-search-close')).toBeFalsy();
    });
    expect(deps.apiService.fetchPlaceDetails).not.toBeCalled();
  });
});

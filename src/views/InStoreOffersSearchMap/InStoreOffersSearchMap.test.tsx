import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import navigation from '@react-navigation/native';

import InStoreOffersSearchMap, { Props } from './InStoreOffersSearchMap';

import { getInitialState } from '_state_mgmt/GlobalState';
import { LocationType } from '_models/cardLink';
import { Deps, FeatureFlag, IGlobalState } from '_models/general';
import { getGeocodeAddress, getLocalOffers_1, getLocalOffers_2 } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { ENV, ROUTES } from '_constants';

const position = {
  coords: {
    latitude: 57.7,
    longitude: 11.93
  }
};

const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockedNavigate, goBack: mockedGoBack })
}));

describe('In Store Search Map', () => {
  let deps: Deps;
  let initialState: IGlobalState;
  let props: Props;
  let ignoredFeatureFlags: FeatureFlag[];

  beforeAll(() => {
    ignoredFeatureFlags = ENV.IGNORED_FEATURE_LIST;
  });

  beforeEach(() => {
    navigation.useIsFocused = jest.fn(() => true);
    initialState = getInitialState();
    deps = getMockDeps();
    props = {
      navigation: { navigate: jest.fn() } as any,
      route: { params: { focusOnSelectedOffer: true } }
    };
    ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
  });

  afterAll(() => {
    ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
  });

  it('should render', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementation(successCallback => {
      successCallback(position);
    });
    const getLocalOffersResponse = getLocalOffers_1();
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffersResponse) as any;
    const { toJSON, findAllByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    expect(await findAllByTestId('in-store-offer-item')).toHaveLength(getLocalOffersResponse.offers.length);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not fetch offers when the component is not focused', async () => {
    navigation.useIsFocused = jest.fn(() => false);
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    await waitFor(() => {
      expect(deps.apiService.fetchLocalOffers).not.toBeCalled();
    });
  });

  it('should render without offers', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementation(successCallback => {
      successCallback(position);
    });
    const localOfferList = getLocalOffers_1();
    localOfferList.offers = [];
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(localOfferList) as any;
    const { toJSON, queryAllByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    await waitFor(() => {
      expect(queryAllByTestId('in-store-offer-item')).toHaveLength(0);
    });
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with more than one offer', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementation(successCallback => {
      successCallback(position);
    });
    const getLocalOffersResponse = getLocalOffers_2();
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffersResponse) as any;
    const { toJSON, findAllByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    expect(await findAllByTestId('in-store-offer-item')).toHaveLength(getLocalOffersResponse.offers.length);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a fallback when the location could not be obtained', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce((_successCallback, errorCallback) => {
      errorCallback(new Error(''));
    });
    const { findByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    expect(await findByTestId('fallback-offers-map-container')).toBeTruthy();
  });

  it('should set the search point if the zip code is provided', async () => {
    initialState.user.currentUser.personal.currentLocation = { zip: 33101, latitude: position.coords.latitude, longitude: position.coords.longitude };
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    const { findByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, initialState);
    expect(await findByTestId('in-store-offers-map-search-point-id')).toBeTruthy();
  });

  it('should render when there was an error with the api', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementation(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockRejectedValue('error');
    const { findByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    expect(await findByTestId('fallback-offers-map-container')).toBeTruthy();
  });

  it('should render the connection banner when there is not internet', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    const { findByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, {
      ...initialState,
      core: { ...initialState.core, isConnected: false }
    });
    expect(await findByTestId('connection-banner-container')).toBeTruthy();
  });

  it('should not render the connection banner when there is internet', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    const { queryByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, {
      ...initialState,
      core: { ...initialState.core, isConnected: true }
    });
    await waitFor(() => {
      expect(queryByTestId('connection-banner-container')).toBeNull();
    });
  });

  it('should select an offer when a marker is pressed', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementation(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    deps.nativeHelperService.platform.OS = 'android';
    const { findAllByTestId, getAllByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, {
      ...initialState,
      core: { ...initialState.core, isConnected: true }
    });
    expect((await findAllByTestId('in-store-offer-container')).length).toBeGreaterThanOrEqual(1);
    const previousStyle = getAllByTestId('in-store-offer-container')[0].props.style;
    fireEvent(getAllByTestId('marker-item')[0], 'onPress', { stopPropagation: jest.fn() });
    expect(previousStyle).not.toEqual(getAllByTestId('in-store-offer-container')[0].props.style);
  });

  it('should select an offer when there is a selected offer and a marker is pressed', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_2()) as any;
    deps.nativeHelperService.platform.OS = 'android';
    initialState.cardLink.offers = getLocalOffers_2().offers;
    props.route.params.selectedOfferId = getLocalOffers_2().offers[0].offerId;
    const { findAllByTestId, getAllByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, {
      ...initialState,
      core: { ...initialState.core, isConnected: true }
    });
    expect((await findAllByTestId('nearby-in-store-offer-offer')).length).toBeGreaterThanOrEqual(1);
    const previousStyle = getAllByTestId('nearby-in-store-offer-offer')[0].props.style;
    fireEvent(getAllByTestId('marker-item')[1], 'onPress', { stopPropagation: jest.fn() });
    expect(previousStyle).not.toEqual(getAllByTestId('nearby-in-store-offer-offer')[0].props.style);
  });

  it('should remove a previously selected marker when the map is tapped', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementation(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    deps.nativeHelperService.platform.OS = 'ios';
    const { findAllByTestId, getAllByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, {
      ...initialState,
      core: { ...initialState.core, isConnected: true }
    });
    expect((await findAllByTestId('in-store-offer-container')).length).toBeGreaterThanOrEqual(1);
    const previousStyle = getAllByTestId('in-store-offer-container')[0].props.style;
    fireEvent(getAllByTestId('marker-item')[0], 'onPress', { stopPropagation: jest.fn() });
    expect(previousStyle).not.toEqual(getAllByTestId('in-store-offer-container')[0].props.style);
    fireEvent.press(getAllByTestId('in-store-offers-map-map-view')[0]);
    expect(previousStyle).toEqual(getAllByTestId('in-store-offer-container')[0].props.style);
  });

  it('should remove a previously selected marker when the marker is pressed again', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementation(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    deps.nativeHelperService.platform.OS = 'android';

    const { findAllByTestId, getAllByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, {
      ...initialState,
      core: { ...initialState.core, isConnected: true }
    });
    expect(await (await findAllByTestId('in-store-offer-container')).length).toBeGreaterThanOrEqual(1);
    const previousStyle = getAllByTestId('in-store-offer-container')[0].props.style;
    fireEvent(getAllByTestId('brand-logo-image')[0], 'onLoad');
    fireEvent(getAllByTestId('marker-item')[0], 'onPress', { stopPropagation: jest.fn() });
    expect(previousStyle).not.toEqual(getAllByTestId('in-store-offer-container')[0].props.style);
    fireEvent(getAllByTestId('marker-item')[0], 'onPress', { stopPropagation: jest.fn() });
    expect(previousStyle).toEqual(getAllByTestId('in-store-offer-container')[0].props.style);
  });

  it('should ask more offers when the Load more button is pressed', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementation(successCallback => {
      successCallback(position);
    });
    const localOfferList = getLocalOffers_1();
    localOfferList.offers = [...new Array(20)].map((_item, index) => {
      return { ...getLocalOffers_1()?.offers[0], offerId: `${index}` };
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(localOfferList) as any;

    const { getByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);

    await waitFor(() => {
      fireEvent.press(getByTestId('in-store-offer-search-result-button-load-more'));
      expect(deps.apiService.fetchLocalOffers).toBeCalledTimes(2);
    });
  });

  it('should search by city or zip code', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.geocodeAddress = jest.fn().mockResolvedValue([getGeocodeAddress()]);
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    const { getByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    fireEvent.changeText(getByTestId('floating-nav-bar-input'), 'something');
    fireEvent(getByTestId('floating-nav-bar-input'), 'onSubmitEditing');
    await waitFor(() => {
      expect(deps.apiService.fetchLocalOffers).toBeCalledTimes(2);
      expect(deps.apiService.geocodeAddress).toBeCalledTimes(1);
    });
  });

  it('should not search by city or zip code when the string is empty', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    deps.apiService.geocodeAddress = jest.fn().mockResolvedValue([getGeocodeAddress()]);
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    const { getByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    fireEvent.changeText(getByTestId('floating-nav-bar-input'), '');
    fireEvent(getByTestId('floating-nav-bar-input'), 'onSubmitEditing');
    await waitFor(() => {
      expect(deps.apiService.geocodeAddress).toBeCalledTimes(0);
    });
  });

  it("should render a fallback when there is an issue searching by city or zip code and the error is related to offer's api", async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementation(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue({});
    deps.apiService.geocodeAddress = jest.fn().mockResolvedValue([getGeocodeAddress()]);
    const { findByTestId, getByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    fireEvent.changeText(getByTestId('floating-nav-bar-input'), 'something');
    fireEvent(getByTestId('floating-nav-bar-input'), 'onSubmitEditing');
    expect(await findByTestId('fallback-offers-map-container')).toBeTruthy();
  });

  it("should render a fallback when there is an issue searching by city or zip code and the error is related to google's API", async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementation(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    deps.apiService.geocodeAddress = jest.fn().mockRejectedValue('error');
    const { findByTestId, getByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    fireEvent.changeText(getByTestId('floating-nav-bar-input'), 'something');
    fireEvent(getByTestId('floating-nav-bar-input'), 'onSubmitEditing');
    expect(await findByTestId('fallback-offers-map-container')).toBeTruthy();
  });

  it("should render a fallback when the list returned by google's API is empty", async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementation(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    deps.apiService.geocodeAddress = jest.fn().mockResolvedValue([]);
    const { findByTestId, getByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    fireEvent.changeText(getByTestId('floating-nav-bar-input'), 'something');
    fireEvent(getByTestId('floating-nav-bar-input'), 'onSubmitEditing');
    expect(await findByTestId('fallback-offers-map-container')).toBeTruthy();
  });

  it('should show a list when search in a specific area', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_2()) as any;
    const { getByTestId, getAllByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    fireEvent(getByTestId('in-store-offers-map-map-view'), 'onRegionChangeComplete', position.coords);
    fireEvent(getByTestId('in-store-offers-map-map-view'), 'onPanDrag');
    fireEvent(getByTestId('in-store-offers-map-map-view'), 'onPanDrag');
    fireEvent(getByTestId('in-store-offers-map-map-view'), 'onRegionChangeComplete', position.coords);
    fireEvent.press(getByTestId('in-store-offers-search-map-search-area-btn'));
    await waitFor(() => {
      expect(getAllByTestId('marker-item').length).toEqual(2);
    });
  });

  it('should render the fallback when search in a specific area', async () => {
    const coords = {
      zip: 11223,
      latitude: 40.6,
      longitude: -73.98
    };
    initialState.user.currentUser.personal.currentLocation = coords;
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    const localOfferList = getLocalOffers_1();
    localOfferList.offers = [];
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(localOfferList) as any;
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, initialState);
    fireEvent(getByTestId('in-store-offers-map-map-view'), 'onPanDrag');
    fireEvent(getByTestId('in-store-offers-map-map-view'), 'onRegionChangeComplete', position.coords);
    fireEvent.press(getByTestId('in-store-offers-search-map-search-area-btn'));
    await waitFor(() => {
      fireEvent.press(getByTestId('in-store-offer-search-result-got-to-my-location'));
      expect(queryByTestId('in-store-offer-search-result-got-to-my-location')).toBeNull();
      expect(deps.apiService.fetchLocalOffers).toBeCalledWith({ latitude: coords.latitude, longitude: coords.longitude });
    });
  });

  it('should load local offers with the user location coords when zip code is not defined', async () => {
    const coords = {
      zip: undefined,
      latitude: undefined,
      longitude: undefined
    };
    initialState.user.currentUser.personal.currentLocation = coords;
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    const localOfferList = getLocalOffers_1();
    localOfferList.offers = [];
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(localOfferList) as any;
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, initialState);
    fireEvent(getByTestId('in-store-offers-map-map-view'), 'onPanDrag');
    fireEvent(getByTestId('in-store-offers-map-map-view'), 'onRegionChangeComplete', position.coords);
    fireEvent.press(getByTestId('in-store-offers-search-map-search-area-btn'));
    await waitFor(() => {
      fireEvent.press(getByTestId('in-store-offer-search-result-got-to-my-location'));
      expect(queryByTestId('in-store-offer-search-result-got-to-my-location')).toBeNull();
      expect(deps.apiService.fetchLocalOffers).toBeCalledWith(position.coords);
    });
  });

  it('should not navigate on search input focus with feature flag', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    const { getByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    fireEvent(getByTestId('floating-nav-bar-input'), 'onFocus');
    await waitFor(() => {
      expect(props.navigation.navigate).not.toBeCalled();
    });
  });

  it('should not navigate on search input focus with local offers are loading', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    const { getByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, initialState);
    fireEvent(getByTestId('floating-nav-bar-input'), 'onFocus');
    await waitFor(() => {
      expect(props.navigation.navigate).not.toBeCalled();
    });
  });

  it('should navigate on search input focus without feature flag', async () => {
    ENV.IGNORED_FEATURE_LIST.splice(ENV.IGNORED_FEATURE_LIST.indexOf(FeatureFlag.PREDICTIVE_MAP_SEARCH), 1);
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    const { getByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    fireEvent(getByTestId('floating-nav-bar-input'), 'onFocus');
    await waitFor(() => {
      expect(props.navigation.navigate).toBeCalled();
    });
  });

  it('should go back with a selected order', async () => {
    ENV.IGNORED_FEATURE_LIST.splice(ENV.IGNORED_FEATURE_LIST.indexOf(FeatureFlag.PREDICTIVE_MAP_SEARCH), 1);
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    initialState.cardLink.offers = getLocalOffers_1().offers;
    props.route.params.selectedOfferId = getLocalOffers_1().offers[0].offerId;
    const { getByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps);
    fireEvent.press(getByTestId('back-button-default'));
    await waitFor(() => {
      expect(mockedGoBack).toBeCalled();
    });
  });

  /** @todo refactor & expect something */
  it('should select an offer', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    initialState.cardLink.offers = getLocalOffers_1().offers;
    props.route.params.selectedOfferId = getLocalOffers_1().offers[0].offerId;

    const { toJSON, getByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, initialState);

    await waitFor(() => {
      fireEvent.press(getByTestId('nearby-in-store-offer-item'));
      expect(toJSON()).toMatchSnapshot();
    });
  });

  /** @todo refactor & expect something */
  it('should activate an offer from footer', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    const offerResponse = getLocalOffers_2();
    offerResponse.offers[0].activeUntil = offerResponse.offers[0].validFrom;
    offerResponse.offers[0].pointsAwarded = { rewardValue: null, rewardType: null };
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(offerResponse) as any;
    initialState.cardLink.offers = offerResponse.offers;
    props.route.params.selectedOfferId = offerResponse.offers[0].offerId;
    const { toJSON, getByTestId } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, initialState);

    await waitFor(() => {
      fireEvent.press(getByTestId('in-store-offer-detail-footer-activate-btn'));
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should search offers by LocationType Offer', async () => {
    const merchantName = 'searched offer';
    const fetchLocalOffers = {
      merchantName,
      latitude: undefined,
      limit: undefined,
      longitude: undefined,
      offset: undefined,
      zip: undefined
    };
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    props.route.params = {
      searchedValue: merchantName,
      locationType: LocationType.OFFER
    };
    renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, initialState);
    await waitFor(() => {
      expect(deps.apiService.fetchLocalOffers).toBeCalledWith({ ...fetchLocalOffers });
    });
  });

  it('should search offers by LocationType Address', async () => {
    const locationString = 'Beverly Hills, CA 90210, USA';
    const fetchLocalOffers = {
      latitude: 34,
      longitude: -118
    };

    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    props.route.params = {
      searchedValue: locationString,
      locationType: LocationType.ADDRESS,
      location: {
        lat: 34,
        lng: -118
      }
    };
    renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, initialState);
    await waitFor(() => {
      expect(deps.apiService.fetchLocalOffers).toBeCalledWith(fetchLocalOffers);
    });
  });

  it('should render on scroll to the selectedOfferId position', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_2()) as any;
    deps.nativeHelperService.platform.OS = 'android';
    initialState.cardLink.offers = getLocalOffers_2().offers;
    props.route.params.selectedOfferId = getLocalOffers_2().offers[1].offerId;
    props.route.params.focusOnSelectedOffer = true;
    const { findByTestId, toJSON } = renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, deps, {
      ...initialState,
      core: { ...initialState.core, isConnected: true }
    });
    fireEvent(await findByTestId('in-store-offer-search-result-scroll'), 'onContentSizeChange');
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not search if there is a searchValue but location is null', async () => {
    props.route.params = {
      searchedValue: 'asd',
      locationType: LocationType.ADDRESS,
      location: null
    };
    const initialStateGetter = () => {
      const resolvedInitialState = getInitialState();
      resolvedInitialState.core.lastRouteKey = ROUTES.IN_STORE_OFFERS.MAP_SEARCH;
      return resolvedInitialState;
    };
    const resolvedDeps = getMockDeps(initialStateGetter);
    resolvedDeps.apiService.fetchLocalOffers = jest.fn();
    renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, resolvedDeps, initialState);
    await waitFor(() => {
      expect(resolvedDeps.apiService.fetchLocalOffers).not.toBeCalled();
    });
  });

  it('should use lastSearchedLocation if location is null but it has the param useLastLocation', async () => {
    props.route.params = {
      searchedValue: 'asd',
      locationType: LocationType.ADDRESS,
      useLastLocation: true,
      location: null
    };
    const initialStateGetter = () => {
      const resolvedInitialState = getInitialState();
      resolvedInitialState.core.lastRouteKey = ROUTES.IN_STORE_OFFERS.MAP_SEARCH;
      return resolvedInitialState;
    };
    const resolvedDeps = getMockDeps(initialStateGetter);
    resolvedDeps.apiService.fetchLocalOffers = jest.fn();
    initialState.cardLink.lastSearchedLocation = position.coords;
    renderWithGlobalContext(<InStoreOffersSearchMap {...props} />, resolvedDeps, initialState);
    await waitFor(() => {
      expect(resolvedDeps.apiService.fetchLocalOffers).toBeCalledWith({ ...position.coords });
    });
  });
});

import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Keyboard, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';

import { ConnectionBanner } from '_components/ConnectionBanner';
import { shouldShowFeature } from '_components/Flagged';
import { ForterActionType, PageNames, PageType, ROUTES, TealiumEventType, UxObject } from '_constants';
import { ICardLinkOffer, InStoreOfferStatus, ILocation, LocationType, IGeocodeLocation } from '_models/cardLink';
import { FeatureFlag } from '_models/general';
import { useCurrentLocation, useGetLinkedCardsList, useGetLocalOffers, useValidateAndActivateLocalOffer } from '_state_mgmt/cardLink/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { isDeepEqual } from '_utils/isDeepEqual';
import { useGeocodeAddress } from '_utils/useGeocodeAddress';
import { useTestingHelper } from '_utils/useTestingHelper';

import { AnimatedBottomList } from './components/AnimatedBottomList';
import { FloatingNavBar } from './components/FloatingNavBar';
import { MapComponent } from './components/InStoreOffersMap';
import { InStoreOfferSearchResult } from './components/InStoreOfferSearchResult';
import { styles } from './styles';

const { height } = Dimensions.get('window');
const mapHeight = height * 0.75;
const limitByDefaultOfResults = 20;
const loadMoreOffersOffset = 20;
const offerHeight = 110;
const nearbyOfferHeight = 90;

interface RouteParams {
  params: {
    selectedOfferId?: string;
    searchedValue?: string;
    focusOnSelectedOffer?: boolean;
    locationType?: LocationType;
    location?: IGeocodeLocation;
    useLastLocation?: boolean;
  };
}

export interface Props {
  navigation: StackNavigationProp<any>;
  route: RouteParams;
}

function isLocalityOrPostalCode(results = []) {
  return results.findIndex(({ types }) => types.find(type => type === 'locality' || type === 'postal_code'));
}

const InStoreOffersSearchMap = ({
  navigation,
  route: {
    params: { selectedOfferId, searchedValue, locationType, location, focusOnSelectedOffer, useLastLocation }
  }
}: Props) => {
  const { trackSystemEvent } = useEventTracker();
  const [searchPoint, setSearchPoint] = useState<ILocation | undefined>(undefined);
  const [wasLoadMoreButtonPressed, setWasLoadMoreButtonPressed] = useState(false);
  const [focusedOfferId, setFocusedOfferId] = useState((focusOnSelectedOffer && selectedOfferId) || '');
  const [invalidZipCodeOrCity, setInvalidZipCodeOrCity] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [wasTheRegionChanged, setWasTheRegionChanged] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef(null);

  const {
    deps: {
      nativeHelperService: {
        platform: { select }
      },
      stateSnapshot
    },
    state: {
      core: { isConnected },
      user: {
        currentUser: {
          personal: {
            currentLocation: { zip, latitude, longitude }
          }
        }
      },
      cardLink: { offers: localOfferList, lastSearchedLocation: storedLastSearchedLocation, linkedCardsList }
    }
  } = useContext(GlobalContext);
  const lastRouteKey = stateSnapshot.get().core.lastRouteKey;

  const [onLoadLinkedCardsList, isLoadingLinkedCardsList = true, linkedCardsListError] = useGetLinkedCardsList();
  const [activateOffer, isActivatingOffer] = useValidateAndActivateLocalOffer();

  const [selectedOffer, setSelectedOffer] = useState<ICardLinkOffer>(localOfferList.find(current => current.offerId === selectedOfferId));
  const [selectedBrandName] = useState<string>(selectedOffer?.brandName);
  const [lastSearchedLocation, setLastSearchedLocation] = useState(storedLastSearchedLocation);

  const { getTestIdProps } = useTestingHelper('in-store-offers-search-map');

  const [onGetLocalOffers, isLoadingLocalOfferList = false, localOfferListError] = useGetLocalOffers();
  const [onGetCurrentLocation, isLocationLoading, locationError] = useCurrentLocation();
  const [onLoadGeocodeAddress, isLoadingGeocodeAddress = false] = useGeocodeAddress();
  const isFocused = useIsFocused();

  const isLoading = useMemo(
    () => isLocationLoading || isLoadingLocalOfferList || isLoadingGeocodeAddress,
    [isLocationLoading, isLoadingGeocodeAddress, isLoadingLocalOfferList]
  );

  const shouldSearchAgain = useCallback(
    (newLocation: ILocation) => {
      return [ROUTES.MAIN_TAB.EARN, ROUTES.IN_STORE_OFFERS.MAP_SEARCH].includes(lastRouteKey) || !isDeepEqual(newLocation, lastSearchedLocation);
    },
    [lastRouteKey, lastSearchedLocation]
  );

  const goToCurrentUserLocation = useCallback(async () => {
    if (selectedBrandName || locationType === LocationType.OFFER) {
      setSearchPoint(lastSearchedLocation);
      onGetLocalOffers({ ...lastSearchedLocation, merchantName: selectedBrandName || searchedValue });
      return;
    }

    if (searchedValue || locationType === LocationType.ADDRESS) {
      const searchLocation = location ? { latitude: location.lat, longitude: location.lng } : useLastLocation ? lastSearchedLocation : null;
      if (shouldSearchAgain(searchLocation)) {
        if (searchLocation) {
          setSearchPoint(searchLocation);
          onGetLocalOffers(searchLocation);
        }
        setLastSearchedLocation(searchLocation);
      }
      setSearchValue(searchedValue);
      return;
    }

    const currentLocation = zip ? { latitude, longitude } : await onGetCurrentLocation();

    if (shouldSearchAgain(currentLocation)) {
      setSearchPoint(currentLocation);
      onGetLocalOffers(currentLocation);
      setLastSearchedLocation(currentLocation);
    }
  }, [
    lastSearchedLocation,
    latitude,
    location,
    locationType,
    longitude,
    onGetCurrentLocation,
    onGetLocalOffers,
    searchedValue,
    selectedBrandName,
    shouldSearchAgain,
    useLastLocation,
    zip
  ]);

  useEffect(() => {
    onLoadLinkedCardsList();
  }, [onLoadLinkedCardsList]);

  useEffect(() => {
    if (isFocused && !isSearching) goToCurrentUserLocation();
  }, [isSearching, isFocused, goToCurrentUserLocation]);

  const handleLocalOffers = useCallback(() => {
    const { latitude: searchPointLatitude, longitude: searchPointLongitude } = searchPoint;
    onGetLocalOffers({
      latitude: searchPointLatitude,
      longitude: searchPointLongitude,
      limit: limitByDefaultOfResults,
      offset: loadMoreOffersOffset,
      merchantName: selectedBrandName
    });
    setWasLoadMoreButtonPressed(true);
  }, [selectedBrandName, onGetLocalOffers, searchPoint]);

  const handleMarkerPress = useCallback(
    (offerId, index) => {
      if (!offerId || offerId === focusedOfferId) {
        setFocusedOfferId('');
        return;
      }
      if (selectedOffer) {
        setSelectedOffer(localOfferList.find(current => current.offerId === offerId));
      }
      setFocusedOfferId(offerId);
      scrollRef.current.scrollTo({ y: (selectedOffer ? nearbyOfferHeight : offerHeight) * index, animated: true });
    },
    [localOfferList, selectedOffer, focusedOfferId]
  );

  const trackEvent = useCallback(
    (newSearchValue: string, results: number, error?: string) =>
      trackSystemEvent(
        error ? TealiumEventType.ERROR : TealiumEventType.OFFER,
        {
          page_name: PageNames.MAIN.EARN,
          page_type: PageType.SELECTION,
          section: ROUTES.MAIN_TAB.EARN,
          sort_by: 'distance: ascending',
          search_term: newSearchValue,
          search_results_num: results.toString(),
          event_type: TealiumEventType.LOCATION,
          event_name: TealiumEventType.IN_STORE,
          event_detail: UxObject.SEARCH,
          uxObject: UxObject.SEARCH,
          error
        },
        ForterActionType.TAP
      ),
    [trackSystemEvent]
  );

  useEffect(() => {
    // Track new values on search
    if (searchValue && !isLoadingLocalOfferList) {
      trackEvent(searchValue, localOfferList.length);
    }
  }, [localOfferList, isLoadingLocalOfferList, searchValue, trackEvent]);

  const handleSearch = useCallback(async () => {
    Keyboard.dismiss();
    if (searchValue === '') return;
    setWasLoadMoreButtonPressed(false);
    const results = await onLoadGeocodeAddress(searchValue);

    const resultIndex = isLocalityOrPostalCode(results);
    if (resultIndex === -1) {
      setInvalidZipCodeOrCity(true);
      trackEvent(searchValue, 0, 'It looks like you entered an invalid zip code or city. Please try again.');
      return;
    }

    setInvalidZipCodeOrCity(false);
    setIsSearching(true);

    const {
      formatted_address,
      geometry: {
        location: { lat, lng }
      }
    } = results[resultIndex];

    setSearchPoint({ latitude: lat, longitude: lng });
    setSearchValue(formatted_address);
    onGetLocalOffers({ latitude: lat, longitude: lng });
  }, [onGetLocalOffers, onLoadGeocodeAddress, searchValue, trackEvent]);

  const handleSearchByArea = useCallback(async () => {
    setIsSearching(true);
    setWasLoadMoreButtonPressed(false);
    setWasTheRegionChanged(false);
    setSearchValue('');
    const { latitude: newLatitude, longitude: newLongitude } = searchPoint;
    onGetLocalOffers({ latitude: newLatitude, longitude: newLongitude, merchantName: selectedBrandName });
  }, [selectedBrandName, onGetLocalOffers, searchPoint]);

  const goToMyLocation = useCallback(async () => {
    setSearchValue('');
    const currentLocation = zip ? { latitude, longitude } : await onGetCurrentLocation();
    setSearchPoint(currentLocation);
    onGetLocalOffers(currentLocation);
    setIsSearching(false);
    setWasTheRegionChanged(false);
  }, [zip, latitude, longitude, onGetCurrentLocation, onGetLocalOffers]);

  const hasLinkedCards = useMemo(
    () => !isLoadingLinkedCardsList && !linkedCardsListError && linkedCardsList.length > 0,
    [isLoadingLinkedCardsList, linkedCardsListError, linkedCardsList.length]
  );

  const getClassItemSelected = useMemo(() => select({ ios: styles.itemSelectedIos, default: styles.itemSelectedAndroid }), [select]);

  const handleSearchFocus = useCallback(() => {
    if (shouldShowFeature(FeatureFlag.PREDICTIVE_MAP_SEARCH) && !isLoadingLocalOfferList) {
      navigation.navigate(ROUTES.IN_STORE_OFFERS.MAP_SEARCH, { searchedValue: searchValue });
    }
  }, [navigation, isLoadingLocalOfferList, searchValue]);

  return (
    <>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="dark-content" />
      <MapComponent
        offers={localOfferList}
        focusedOfferId={focusedOfferId}
        searchPoint={searchPoint}
        height={mapHeight}
        onOfferSelectedChanged={handleMarkerPress}
        onRegionChanged={(newRegion: ILocation) => {
          setWasTheRegionChanged(true);
          setSearchPoint(newRegion);
        }}
      />
      <ConnectionBanner style={styles.connectionBanner} title="Uh-oh. There’s a connection issue." />
      <FloatingNavBar
        style={!isConnected && styles.search}
        selectedOffer={selectedOffer}
        searchValue={searchValue}
        setSearchValue={shouldShowFeature(FeatureFlag.PREDICTIVE_MAP_SEARCH) ? handleSearchFocus : setSearchValue}
        onPressSearch={!shouldShowFeature(FeatureFlag.PREDICTIVE_MAP_SEARCH) ? handleSearch : undefined}
        returnKeyType="search"
        onSearchFocus={handleSearchFocus}
      />
      {wasTheRegionChanged && (
        <View style={styles.floatingActionsContainer}>
          <TouchableOpacity style={styles.floatingButton} onPress={handleSearchByArea} {...getTestIdProps('search-area-btn')}>
            <Text style={styles.floatingButtonText}>Search in this area</Text>
          </TouchableOpacity>
        </View>
      )}
      <AnimatedBottomList
        resultNumber={isLoadingLocalOfferList ? 0 : localOfferList?.length}
        selectedOffer={selectedOffer}
        hideFooter={!focusedOfferId}
        onActivateRequested={() =>
          activateOffer(selectedOffer, hasLinkedCards).then(() => {
            setSelectedOffer({ ...selectedOffer, status: InStoreOfferStatus.ACTIVE });
          })
        }
      >
        <InStoreOfferSearchResult
          isLoading={isLoading}
          hasLinkedCards={hasLinkedCards}
          fetchingOffersError={localOfferListError}
          invalidSearchError={invalidZipCodeOrCity}
          gettingLocationError={locationError}
          resultNumber={localOfferList?.length}
          isSearching={isSearching}
          isRequestingMoreResults={wasLoadMoreButtonPressed}
          allowNavigation={!selectedOffer}
          disabled={isActivatingOffer}
          scrollRef={scrollRef}
          buildItemStyle={item => [styles.item, item.offerId === focusedOfferId && getClassItemSelected]}
          buildItemShowStreet={item => item.offerId === focusedOfferId}
          onGoBackToLocationPressed={goToMyLocation}
          onLoadMorePressed={handleLocalOffers}
          onOfferSelected={handleMarkerPress}
        />
      </AnimatedBottomList>
    </>
  );
};

export default memo(InStoreOffersSearchMap);

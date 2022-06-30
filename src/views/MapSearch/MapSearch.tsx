import React, { memo, useState, useCallback, useRef, useEffect, useMemo, useContext } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';

import { ConnectionBanner } from '_components/ConnectionBanner/ConnectionBanner';
import { SearchInput } from '_components/SearchInput';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useGeocodePlace, useGeocodePlaceDetails } from '_utils/useGeocodePlace';
import { createUUID } from '_utils/create-uuid';
import LocationErrorIcon from '_assets/in-store-offer/locationPurpleError.svg';
import LocationRedErrorIcon from '_assets/in-store-offer/locationError.svg';
import { COLOR, ROUTES, ENV, ICON, FONT_SIZE } from '_constants';
import { useDebounce } from '_utils/useDebounce';
import { NearbyInStoreOffer } from '_components/InStoreOffers/components/NearbyInStoreOffer';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { LocationType, ILocationStorage, IGeocodePlacePrediction } from '_models/cardLink';
import { useCurrentLocation, useGetLocalOffers } from '_state_mgmt/cardLink/hooks';
import { Icon } from '_commons/components/atoms/Icon';

import { styles } from './styles';
import { FallbackOffers } from '../InStoreOffersSearchMap/components/FallbackOffers';

const MIN_SEARCH_LENGTH = 3;

interface RouteParams {
  params: {
    searchedValue?: string;
  };
}

export interface Props {
  navigation: StackNavigationProp<any>;
  route: RouteParams;
}

export const MapSearch = ({ navigation, route }: Props) => {
  const { getTestIdProps } = useTestingHelper('map-search');
  const [searchValue, setSearchValue] = useState(route.params.searchedValue ?? '');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [sessionToken, setSessionToken] = useState('');
  const [onLoadGeocodePlace, , , places = { predictions: [] }] = useGeocodePlace();
  const [onLoadGeocodePlaceDetails] = useGeocodePlaceDetails();
  const inputRef = useRef<TextInput>();
  const [locations, setLocations] = useState<ILocationStorage[]>();
  const [onGetLocalOffers, , localOfferListError] = useGetLocalOffers();
  const [onGetCurrentLocation] = useCurrentLocation();

  const {
    deps: {
      nativeHelperService: { storage }
    },
    state: {
      user: {
        currentUser: {
          personal: {
            currentLocation: { zip, latitude, longitude }
          }
        }
      },
      cardLink: { offers }
    }
  } = useContext(GlobalContext);

  const placesOrDefault = useMemo(() => {
    return {
      predictions: places?.predictions || []
    };
  }, [places]);

  const localOffersGroup = useMemo(() => {
    return [...new Map(offers.map(offer => [offer.brandName, offer])).values()];
  }, [offers]);

  const debouncedSearch = useDebounce(searchValue, ENV.LOCAL_OFFERS.SEARCH_DEBOUNCE_MS);

  const isFallbackResults = useMemo(
    () => searchValue?.length > MIN_SEARCH_LENGTH && placesOrDefault.predictions.length === 0 && localOffersGroup.length === 0,
    [searchValue, placesOrDefault, localOffersGroup]
  );

  const navigateToMap = useCallback(
    (locationType, searchItem: IGeocodePlacePrediction | string) => {
      navigation.navigate(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP, {
        locationType,
        searchedValue:
          locationType === LocationType.OFFER
            ? (searchItem as string)
            : `${(searchItem as IGeocodePlacePrediction).structured_formatting.main_text}, ${
                (searchItem as IGeocodePlacePrediction).structured_formatting.secondary_text
              }`,
        location: locationType === LocationType.OFFER ? null : (searchItem as IGeocodePlacePrediction).place_details.geometry.location
      });
    },
    [navigation]
  );

  const handleSaveLocationOrOffer = useCallback(
    async (locationType: LocationType, searchItem: IGeocodePlacePrediction | string) => {
      const items: ILocationStorage[] = (await storage.get<ILocationStorage[]>(ENV.STORAGE_KEY.LOCAL_OFFERS_SEARCH_HISTORY)) || [];
      const value = locationType === LocationType.OFFER ? (searchItem as string) : (searchItem as IGeocodePlacePrediction).place_id;
      storage.set(
        ENV.STORAGE_KEY.LOCAL_OFFERS_SEARCH_HISTORY,
        [{ type: locationType, value, searchItem, timestamp: Date.now() }, ...items]
          .filter((address, index, self) => index === self.findIndex(item => item.value === address.value))
          .slice(0, 5)
      );
    },
    [storage]
  );

  const handleSearchChange = value => {
    setSearchValue(value);
  };

  const handleSearch = useCallback(
    async (debouncedSearchValue?: string) => {
      await Promise.all([
        onLoadGeocodePlace(debouncedSearchValue, sessionToken, `${currentLocation.latitude},${currentLocation.longitude}`),
        onGetLocalOffers({ ...currentLocation, merchantName: debouncedSearchValue })
      ]);
    },
    [currentLocation, onGetLocalOffers, onLoadGeocodePlace, sessionToken]
  );

  const handleSearchDetails = useCallback(
    async (locationType: LocationType, searchItem: IGeocodePlacePrediction) => {
      const placeDetails = await onLoadGeocodePlaceDetails(searchItem.place_id, sessionToken);
      placesOrDefault.predictions.find(prediction => prediction.place_id === searchItem.place_id).place_details = placeDetails;

      handleSaveLocationOrOffer(locationType, searchItem);
      navigateToMap(locationType, searchItem);
    },
    [onLoadGeocodePlaceDetails, navigateToMap, placesOrDefault, sessionToken, handleSaveLocationOrOffer]
  );

  const setCurrentUserLocation = useCallback(async () => {
    const newCurrentLocation = zip ? { latitude, longitude } : await onGetCurrentLocation();
    setCurrentLocation(newCurrentLocation);
  }, [onGetCurrentLocation, zip, latitude, longitude]);

  useEffect(() => {
    const newSessionToken = createUUID();
    setSessionToken(newSessionToken);
  }, []);

  useEffect(() => {
    setCurrentUserLocation();
  }, [setCurrentUserLocation]);

  useEffect(() => {
    if (!currentLocation) return;
    if (debouncedSearch && debouncedSearch.length >= MIN_SEARCH_LENGTH) {
      handleSearch(debouncedSearch);
    } else {
      handleSearch();
    }
  }, [debouncedSearch, onLoadGeocodePlace, handleSearch, sessionToken, currentLocation]);

  useEffect(() => {
    inputRef.current.focus();
    async function getLocations() {
      setLocations(await storage.get<ILocationStorage[]>(ENV.STORAGE_KEY.LOCAL_OFFERS_SEARCH_HISTORY));
    }
    getLocations();
  }, [storage]);

  const handleCardLinkLocalOfferTab = useCallback(
    (locationType: LocationType, searchItem: IGeocodePlacePrediction | string) => {
      if (locationType === LocationType.ADDRESS && !(searchItem as IGeocodePlacePrediction).place_details) {
        handleSearchDetails(locationType, searchItem as IGeocodePlacePrediction);
        return;
      }
      handleSaveLocationOrOffer(locationType, searchItem);

      navigateToMap(locationType, searchItem);
    },
    [handleSaveLocationOrOffer, navigateToMap, handleSearchDetails]
  );

  const shouldShowRecentSearches = useMemo(() => {
    const result = debouncedSearch.length < MIN_SEARCH_LENGTH;
    return result;
  }, [debouncedSearch]);

  const shouldShowPredictiveSearch = useMemo(() => {
    return debouncedSearch.length >= MIN_SEARCH_LENGTH && placesOrDefault.predictions.length;
  }, [debouncedSearch, placesOrDefault]);

  const getFallback = useCallback(
    () =>
      localOfferListError ? (
        <FallbackOffers
          icon={<LocationRedErrorIcon width={80} height={80} />}
          description="Uh-oh. We can't load the stores"
          note="Please try again later. In the meantime, please explore the MAX catalog."
          noteStyle={{ fontSize: 16 }}
        />
      ) : (
        <FallbackOffers
          icon={<LocationErrorIcon width={80} height={80} />}
          description="Uh-oh. It looks like we can't find what you've entered."
          note="Please try again."
          noteStyle={{ fontSize: 16 }}
        />
      ),
    [localOfferListError]
  );

  const getAddressTitle = useCallback(
    (address: string) => {
      const addressLowerCase = address.toLowerCase();
      const searchValueLowerCase = searchValue.toLowerCase();
      // Search for text match index
      const separatorIndex = addressLowerCase.indexOf(searchValueLowerCase);

      if (separatorIndex === -1) {
        return <Text style={styles.addressTitle}>{address}</Text>;
      }

      // Split the address string with the search value as separator and remove empty results.
      // Once the split is done put the search value into the correct position of the parsed string array.
      const parsedString = addressLowerCase.split(searchValueLowerCase).filter(text => text !== '');
      parsedString.splice(separatorIndex, 0, searchValueLowerCase);
      // Split the address to compare which word must be capitalized.
      const splitAddress = address.split(' ').map(str => str.toLowerCase());

      return (
        <>
          {parsedString.map((value: string, index: number) => {
            // Split the parsed string and compare each value to know if one of the words needs to be capitalized.
            // If not return the same text.
            const text = value
              .split(' ')
              .map((textValue: string) =>
                splitAddress.includes(textValue) || index === 0 ? textValue.charAt(0).toUpperCase() + textValue.substring(1) : textValue
              )
              .join(' ');
            const isBold = value.toLowerCase() === searchValueLowerCase;

            return isBold ? (
              <Text key={index} {...getTestIdProps('item-address-bold')} style={[styles.addressTitle, isBold && { ...styles.addressTitleMatch }]}>
                {text}
              </Text>
            ) : (
              <Text key={index} style={styles.addressTitle}>
                {text}
              </Text>
            );
          })}
        </>
      );
    },
    [searchValue, getTestIdProps]
  );

  const ResultAddress = useCallback(
    ({ place }) => {
      return (
        <TouchableOpacity {...getTestIdProps('item-address')} onPress={() => handleCardLinkLocalOfferTab(LocationType.ADDRESS, place)}>
          <View style={[styles.address, styles.addressMain]}>
            <View style={styles.addressIcon}>
              <Icon name={ICON.LOCATION} color={COLOR.BLACK} size={FONT_SIZE.PETITE} />
            </View>
            <View style={styles.addressContainer}>
              <View style={styles.address}>
                <Text style={styles.addressTitle}>{getAddressTitle(place.structured_formatting.main_text)}</Text>
              </View>
              <View style={styles.address}>
                <Text style={styles.addressSubTitle}>{place.structured_formatting.secondary_text}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [getAddressTitle, getTestIdProps, handleCardLinkLocalOfferTab]
  );

  return (
    <>
      <ConnectionBanner />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Pressable
            style={styles.back}
            onPress={() =>
              navigation.navigate(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP, {
                searchedValue: searchValue,
                useLastLocation: searchValue === route.params.searchedValue,
                location: null
              })
            }
            {...getTestIdProps('back')}
          >
            <Icon name={ICON.ARROW_LEFT} color={COLOR.BLACK} size={FONT_SIZE.BIG} />
          </Pressable>
          <View style={styles.searchContainer}>
            <SearchInput
              value={searchValue}
              placeholder="Search by city, zip code or store"
              onChange={handleSearchChange}
              hideFilters
              searchContainerStyle={styles.searchContainerStyle}
              searchInputStyle={[styles.searchInputStyle, !searchValue && styles.searchInputEmptyStyle]}
              placeholderTextColor={COLOR.DARK_GRAY}
              Icon={<Icon name={ICON.SEARCH} color={COLOR.BLACK} />}
              cursorColor={COLOR.BLACK}
              ref={inputRef}
            />
            {!!searchValue && (
              <Pressable
                style={styles.closeIcon}
                onPress={() => {
                  setSearchValue('');
                  placesOrDefault.predictions = [];
                }}
                {...getTestIdProps('close')}
              >
                <View style={styles.closeIconBackground}>
                  <Icon name={ICON.CLOSE} color={COLOR.WHITE} size={FONT_SIZE.REGULAR} />
                </View>
              </Pressable>
            )}
          </View>
        </View>
        <ScrollView contentContainerStyle={isFallbackResults && styles.containerError} style={[styles.container, styles.scroll]}>
          {isFallbackResults ? (
            getFallback()
          ) : (
            <View style={styles.containerBox}>
              {shouldShowPredictiveSearch && placesOrDefault.predictions.length
                ? placesOrDefault.predictions.slice(0, 3).map(place => <ResultAddress key={place.place_id} place={place as IGeocodePlacePrediction} />)
                : null}

              {shouldShowRecentSearches && !placesOrDefault.predictions.length && locations?.length > 0 && (
                <View>
                  <Text style={styles.titleSection}>Recent Search History</Text>
                  {locations.map((location, index) => {
                    return (
                      <TouchableOpacity
                        {...getTestIdProps('recent-search-item')}
                        onPress={() => handleCardLinkLocalOfferTab(location.type, location.searchItem)}
                        key={index}
                      >
                        <View style={styles.itemsSearchHistory}>
                          <Icon name={ICON.SEARCH} color={COLOR.BLUE_NAVIGATION} size={FONT_SIZE.SMALL} />
                          {location.type === LocationType.OFFER ? (
                            <Text style={styles.itemZipCode}>{location.searchItem}</Text>
                          ) : (
                            <>
                              <Text style={styles.itemZipCode}>{(location.searchItem as IGeocodePlacePrediction).structured_formatting.main_text}</Text>
                              <Text style={styles.itemText} numberOfLines={1}>
                                {' '}
                                • {(location.searchItem as IGeocodePlacePrediction).structured_formatting.secondary_text}
                              </Text>
                            </>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              <View style={{ paddingTop: 10 }}>
                {localOffersGroup && !localOffersGroup.length ? null : (
                  <>
                    <Text style={styles.titleSection}>Participating locations</Text>
                    {localOffersGroup.slice(0, 10).map((offer, key) => (
                      <View key={key} style={styles.offers}>
                        <NearbyInStoreOffer
                          hideMiles
                          offer={offer}
                          disabled={false}
                          onPress={() => handleCardLinkLocalOfferTab(LocationType.OFFER, offer.brandName)}
                        />
                      </View>
                    ))}
                  </>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default memo(MapSearch);

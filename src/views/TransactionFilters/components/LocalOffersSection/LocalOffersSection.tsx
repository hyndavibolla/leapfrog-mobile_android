import React, { memo, useCallback, useContext, useEffect } from 'react';
import { FlatList, Pressable, Text } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { BrandLogo } from '_components/BrandLogo';
import { BubbleSkeleton } from '../BubbleSkeleton';

import { useTestingHelper } from '_utils/useTestingHelper';
import { useLocationPermission } from '_utils/useLocationPermission';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useCurrentLocation, useGetLocalOffers } from '_state_mgmt/cardLink/hooks';
import { TransactionFilter } from '_models/offer';
import { LocationType } from '_models/cardLink';

import { getNote } from '_utils/transactionFiltersUtil';
import { ROUTES } from '_constants';
import { numberOfBubbles, numberOfItemsToShow } from '_constants/transactionFilter';

import FallbackIcon from '_assets/fallbackTransactions/fallback.svg';

import { styles } from './styles';

export interface Props {
  transactionType: TransactionFilter;
}

function LocalOffersSection({ transactionType }: Props) {
  const { navigate } = useNavigation();
  const isFocused = useIsFocused();
  const { getTestIdProps } = useTestingHelper('local-offers-section');
  const { isLocationAvailable } = useLocationPermission();
  const [onGetCurrentLocation, isLocationLoading, locationError] = useCurrentLocation();
  const [onGetLocalOffers, isLoadingLocalOffers, localOffersError, localOffers] = useGetLocalOffers();

  const {
    state: {
      user: {
        currentUser: {
          personal: {
            currentLocation: { zip, latitude, longitude }
          }
        }
      }
    }
  } = useContext(GlobalContext);

  useEffect(() => {
    if (!isFocused || !isLocationAvailable) return;
    if (zip) {
      onGetLocalOffers({ latitude, longitude, limit: numberOfItemsToShow });
    } else {
      onGetCurrentLocation().then(({ latitude: newLatitude, longitude: newLongitude }) =>
        onGetLocalOffers({ latitude: newLatitude, longitude: newLongitude, limit: numberOfItemsToShow })
      );
    }
  }, [isFocused, isLocationAvailable, latitude, longitude, onGetCurrentLocation, onGetLocalOffers, zip]);

  const renderOffer = useCallback(
    ({ item: { brandLogo, brandName } }) => {
      return (
        <Pressable
          onPress={() => navigate(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP, { locationType: LocationType.OFFER, searchedValue: brandName })}
          {...getTestIdProps('offer')}
        >
          <BrandLogo
            style={[styles.bubble, localOffers?.offers?.length <= numberOfBubbles && styles.SpecialBubble]}
            image={brandLogo}
            size={60}
            Fallback={FallbackIcon}
          />
        </Pressable>
      );
    },
    [getTestIdProps, localOffers?.offers?.length, navigate]
  );

  if (isLocationLoading || isLoadingLocalOffers) {
    return <BubbleSkeleton />;
  }

  if (locationError || localOffersError || !isLocationAvailable || !localOffers?.offers?.length) {
    return null;
  }

  const offers = localOffers?.offers.reduce((nonRepeatedOffers, offer, index, currentOffers) => {
    if (currentOffers.findIndex(({ brandName }) => brandName === offer.brandName) === index) {
      nonRepeatedOffers.push(offer);
    }
    return nonRepeatedOffers;
  }, []);

  return (
    <>
      <Text style={styles.note}>{getNote(transactionType)}</Text>
      <FlatList
        style={[styles.bubbles, offers.length <= numberOfBubbles && styles.specialBubbles]}
        contentContainerStyle={offers.length <= numberOfBubbles && styles.bubblesContainer}
        data={offers}
        renderItem={renderOffer}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </>
  );
}

export default memo(LocalOffersSection);

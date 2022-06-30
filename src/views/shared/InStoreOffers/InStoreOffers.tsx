import React, { memo, useContext, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { Loading } from '../../Loading';

import { GlobalContext } from '../../../state-mgmt/GlobalState';

import { useCurrentLocation, useGetLinkedCardsList, useGetLocalOffers } from '../../../state-mgmt/cardLink/hooks';
import { useTestingHelper } from '../../../utils/useTestingHelper';

import CardFallbackIcon from '../../../assets/in-store-offer/cardFallback.svg';
import RefreshFallBackIcon from '../../../assets/in-store-offer/refreshFallBack.svg';

import { styles } from './styles';
import { EmptyState } from '../EmptyState';
import { InStoreOfferList } from './components/InStoreOfferList';

const numberOfResultsToReturn = 4;

export const InStoreOffers = () => {
  const {
    deps: {
      nativeHelperService: { geolocation }
    },
    state: {
      cardLink: { linkedCardsList },
      user: {
        currentUser: {
          personal: {
            currentLocation: { zip, latitude, longitude }
          }
        }
      }
    }
  } = useContext(GlobalContext);

  const isFocused = useIsFocused();
  const { getTestIdProps } = useTestingHelper('in-store-offers');

  const [onGetLocalOffers, isLoadingLocalOfferList = true, errorLocalOfferList, localOfferList] = useGetLocalOffers();
  const [onLoadLinkedCardsList, isLoadingLinkedCardsList = true, linkedCardsListError] = useGetLinkedCardsList();

  const [onGetCurrentLocation, isLocationLoading, locationError] = useCurrentLocation();

  useEffect(() => {
    onLoadLinkedCardsList();
  }, [onLoadLinkedCardsList]);

  useEffect(() => {
    if (!isFocused) return;

    if (zip) {
      onGetLocalOffers({ latitude, longitude, limit: numberOfResultsToReturn });
    } else {
      onGetCurrentLocation().then(({ latitude: newLatitude, longitude: newLongitude }) =>
        onGetLocalOffers({ latitude: newLatitude, longitude: newLongitude, limit: numberOfResultsToReturn })
      );
    }
  }, [geolocation, isFocused, latitude, longitude, onGetLocalOffers, onGetCurrentLocation, zip]);

  const hasLinkedCards = useMemo(
    () => !isLoadingLinkedCardsList && !linkedCardsListError && linkedCardsList.length > 0,
    [isLoadingLinkedCardsList, linkedCardsListError, linkedCardsList.length]
  );

  if (errorLocalOfferList || locationError) {
    return (
      <EmptyState
        visible
        Icon={RefreshFallBackIcon}
        title="Whoops! There is a problem."
        subtitleLine1="Sorry! Something went wrong."
        subtitleLine2="Please try again."
        card
      />
    );
  }

  if (isLoadingLocalOfferList || isLocationLoading) {
    return <Loading style={styles.loading} text="Searching nearby locations" />;
  }

  if (!isLoadingLocalOfferList && localOfferList?.offers.length === 0) {
    return (
      <EmptyState
        visible
        Icon={CardFallbackIcon}
        title="Nothing available nearby"
        subtitleLine1="Unfortunately, we can't find any participating restaurants near you. "
        card
      />
    );
  }

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <InStoreOfferList
        hasLinkedCards={hasLinkedCards}
        buildItemStyle={(_, index) => (index === localOfferList?.offers?.length - 1 ? styles.lastItem : styles.item)}
      />
    </View>
  );
};

export default memo(InStoreOffers);

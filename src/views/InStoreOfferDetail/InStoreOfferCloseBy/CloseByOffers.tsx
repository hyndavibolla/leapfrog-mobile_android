import React, { memo, useMemo, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useTestingHelper } from '../../../utils/useTestingHelper';
import { GlobalContext } from '../../../state-mgmt/GlobalState';

import { styles } from './styles';
import { ROUTES } from '../../../constants';
import { NearbyInStoreOffer } from '../../shared/InStoreOffers/components/NearbyInStoreOffer';
import { useGetLocalOffers } from '../../../state-mgmt/cardLink/hooks';
import { StackNavigationProp } from '@react-navigation/stack';

export interface Props {
  offerId: string;
  disabled?: boolean;
  navigation: StackNavigationProp<any>;
}

const maxOffers = 4;

const CloseByOffers = ({ offerId, disabled, navigation }: Props) => {
  const { getTestIdProps } = useTestingHelper('in-store-offer-close-by');
  const {
    state: {
      cardLink: { offers, lastSearchedLocation }
    }
  } = useContext(GlobalContext);

  const offer = offers.find(offerToFind => offerToFind?.offerId === offerId);

  const [onGetLocalOffersWithMerchantName, isLoadingGetLocalOffersWithMerchantName = true, , localOfferListWithMerchantName] = useGetLocalOffers();

  useEffect(() => {
    onGetLocalOffersWithMerchantName({ ...lastSearchedLocation, merchantName: offer?.brandName, limit: maxOffers + 1, dataShouldBePersisted: false });
  }, [lastSearchedLocation, offer, onGetLocalOffersWithMerchantName]);

  const closeOffers = useMemo(
    () =>
      (isLoadingGetLocalOffersWithMerchantName
        ? []
        : localOfferListWithMerchantName?.offers?.filter(({ offerId: currentOfferId }) => currentOfferId !== offer?.offerId)
      )?.slice(0, maxOffers),
    [isLoadingGetLocalOffersWithMerchantName, localOfferListWithMerchantName, offer?.offerId]
  );

  return closeOffers?.length ? (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.titleContent} {...getTestIdProps('title')}>
          Other options close by
        </Text>
        <TouchableOpacity
          {...getTestIdProps('web-url')}
          onPress={() => navigation.push(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP, { selectedOfferId: offerId })}
          style={styles.viewOnMapButton}
        >
          <Text style={styles.viewOnMapButtonText}>View on Map</Text>
        </TouchableOpacity>
      </View>
      {closeOffers.map(closeOffer => (
        <NearbyInStoreOffer
          key={closeOffer.offerId}
          offer={closeOffer}
          disabled={disabled}
          style={styles.nearbyInStoreOffer}
          onPress={() => navigation.push(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP, { selectedOfferId: closeOffer.offerId, focusOnSelectedOffer: true })}
        />
      ))}
    </>
  ) : null;
};

export default memo(CloseByOffers);

import React, { memo, useState } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';

import { BrandLogo } from '_components/BrandLogo';

import { useTestingHelper } from '_utils/useTestingHelper';
import { ICardLinkOffer } from '_models/cardLink';

import RestaurantFallback from '_assets/in-store-offer/restaurantFallback.svg';
import { styles } from './styles';

export interface Props {
  offer: ICardLinkOffer;
  focusedOfferId?: string;
  index: number;
  onOfferSelectedChanged: (offerId?: string, offerIndex?: number) => void;
}

const InStoreOfferMarkers = ({ offer, onOfferSelectedChanged, index, focusedOfferId }: Props) => {
  const { getTestIdProps } = useTestingHelper('marker');
  const [markersReady, setMarkersReady] = useState<boolean>(false);

  const {
    offerId,
    merchant: {
      address: { latitude, longitude }
    },
    brandLogo
  } = offer;

  return (
    <Marker
      {...getTestIdProps('item')}
      key={offerId}
      identifier={offerId}
      coordinate={{
        latitude,
        longitude
      }}
      onPress={event => {
        event.stopPropagation();
        onOfferSelectedChanged(offerId, index);
      }}
      tracksViewChanges={focusedOfferId === offerId || !markersReady}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.marker, focusedOfferId === offerId && styles.markerSelected]}>
          <BrandLogo image={brandLogo} size={20} style={styles.image} Fallback={RestaurantFallback} onLoadImageCallback={() => setMarkersReady(true)} />
        </View>
        <View style={[styles.triangle, focusedOfferId === offerId && styles.triangleSelected]} />
      </View>
    </Marker>
  );
};

export default memo(InStoreOfferMarkers);

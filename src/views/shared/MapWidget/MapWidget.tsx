import React, { memo, useRef, useEffect } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Stars from 'react-native-stars';

import { ICardLinkOffer } from '_models/cardLink';
import { useTestingHelper } from '_utils/useTestingHelper';
import CriticalError from '_assets/shared/criticalError.svg';
import RestaurantFallback from '_assets/in-store-offer/restaurantFallback.svg';
import { CONTAINER_STYLE, CUSTOM_MAP_STYLES } from '_constants';
import YellowStar from '_assets/shared/simpleFilledStar.svg';
import DisabledStarIcon from '_assets/shared/simpleEmptyStar.svg';
import { BrandLogo } from '../BrandLogo';
import { styles } from './styles';

export interface Props {
  onPress: () => void;
  offer: ICardLinkOffer;
  isActive: boolean;
  numberOfStars?: number;
}

const MapWidget = ({ onPress, offer, isActive, numberOfStars }: Props) => {
  const { getTestIdProps } = useTestingHelper('map-widget');
  const mapRef = useRef(null);

  useEffect(() => {
    /* istanbul ignore next */
    setTimeout(() => {
      if (mapRef.current) {
        const list = [];
        if (offer?.offerId) list.push(offer?.offerId);
        mapRef.current.fitToSuppliedMarkers(list, { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 } });
      }
    });
  }, [offer?.offerId]);

  if (!offer || !offer?.offerId || !offer?.merchant?.address?.latitude || !offer?.merchant?.address?.longitude) {
    return (
      <View style={styles.container} {...getTestIdProps('fallback-container')}>
        <View style={[CONTAINER_STYLE.shadow, styles.cardContainer]}>
          <ImageBackground imageStyle={{ borderRadius: 6 }} style={styles.imageBackground} source={require('_assets/shared/exploreOnTheMap.png')}>
            <View style={styles.fallbackContentContainer}>
              <CriticalError width={45} height={45} />
              <Text style={styles.fallbackText}>Unable to show the store</Text>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          {...getTestIdProps('map-container')}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          showsPointsOfInterest={false}
          showsMyLocationButton={false}
          showsCompass={false}
          showsBuildings={false}
          showsIndoors={false}
          showsUserLocation={false}
          onPress={onPress}
          initialRegion={{
            latitude: offer?.merchant?.address?.latitude,
            longitude: offer?.merchant?.address?.longitude,
            latitudeDelta: 0.015 * 5,
            longitudeDelta: 0.0121 * 5
          }}
          pitchEnabled={false}
          rotateEnabled={false}
          zoomEnabled={false}
          scrollEnabled={false}
          customMapStyle={CUSTOM_MAP_STYLES}
        >
          <Marker
            {...getTestIdProps('marker')}
            key={offer?.offerId}
            identifier={offer?.offerId}
            coordinate={{
              latitude: offer?.merchant?.address?.latitude,
              longitude: offer?.merchant?.address?.longitude
            }}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <BrandLogo image={offer.brandLogo} size={20} style={styles.image} Fallback={RestaurantFallback} />
              </View>
              <View style={styles.triangle} />
            </View>
          </Marker>
        </MapView>

        <View style={styles.milesLabelContainer}>
          <View style={[styles.milesLabel, isActive && styles.milesLabelSelected]} {...getTestIdProps('miles-label')}>
            <Text adjustsFontSizeToFit style={[styles.milesLabelText, isActive && styles.milesLabelTextSelected]}>
              {offer?.merchant?.merchantDistance ? `${offer?.merchant?.merchantDistance} miles away` : 'Near your location'}
            </Text>
          </View>
        </View>

        {numberOfStars ? (
          <View {...getTestIdProps('stars')} style={styles.stars}>
            <Stars
              disabled
              default={numberOfStars}
              count={5}
              starSize={20}
              spacing={1}
              fullStar={<YellowStar width={20} height={20} />}
              emptyStar={<DisabledStarIcon width={20} height={20} />}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default memo(MapWidget);

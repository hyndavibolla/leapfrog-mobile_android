import React, { memo, useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { InStoreOfferMarkers } from '../InStoreOfferMarkers';

import { useTestingHelper } from '_utils/useTestingHelper';
import { ICardLinkOffer, ILocation } from '_models/cardLink';
import { CUSTOM_MAP_STYLES } from '_constants';

import { styles } from './styles';

const searchPointId = 'search-point-id';

export interface Props {
  offers?: ICardLinkOffer[];
  focusedOfferId?: string;
  searchPoint: ILocation;
  height: number;
  onOfferSelectedChanged: (offerId?: string, offerIndex?: number) => void;
  onRegionChanged: (region: ILocation) => void;
}

const InStoreOffersMap = ({ offers, focusedOfferId, searchPoint, height, onOfferSelectedChanged, onRegionChanged }: Props) => {
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const mapRef = useRef<MapView>(null);
  const { getTestIdProps } = useTestingHelper('in-store-offers-map');

  useEffect(() => {
    /* istanbul ignore next */
    setTimeout(() => {
      if (mapRef.current) {
        const markers = [...offers.map(({ offerId }) => offerId), searchPointId];
        if (markers.length > 1) {
          mapRef.current.fitToSuppliedMarkers(markers, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
          });
        } else {
          mapRef.current.animateToRegion({ ...searchPoint, latitudeDelta: 0.05, longitudeDelta: 0.05 });
        }
      }
    });
  }, [offers, searchPoint]);

  return (
    <MapView
      {...getTestIdProps('map-view')}
      style={[styles.container, { height }]}
      provider={PROVIDER_GOOGLE}
      loadingEnabled
      ref={mapRef}
      showsPointsOfInterest={false}
      showsMyLocationButton={false}
      showsCompass={false}
      showsBuildings={false}
      showsIndoors={false}
      showsUserLocation
      onPanDrag={() => !isDraggingMap && setIsDraggingMap(true)}
      onRegionChangeComplete={(region: Region) => {
        if (isDraggingMap) {
          setIsDraggingMap(false);
          onRegionChanged(region);
        }
      }}
      onPress={() => onOfferSelectedChanged()}
      customMapStyle={CUSTOM_MAP_STYLES}
    >
      {searchPoint && (
        <Marker
          {...getTestIdProps(searchPointId)}
          key={searchPointId}
          identifier={searchPointId}
          coordinate={{ latitude: searchPoint.latitude, longitude: searchPoint.longitude }}
          opacity={0}
          tracksViewChanges={false}
        />
      )}

      {offers?.map((offer, index) => {
        return (
          <InStoreOfferMarkers
            key={offer.offerId}
            offer={offer}
            index={index}
            focusedOfferId={focusedOfferId}
            onOfferSelectedChanged={onOfferSelectedChanged}
          />
        );
      })}
    </MapView>
  );
};

export default memo(InStoreOffersMap);

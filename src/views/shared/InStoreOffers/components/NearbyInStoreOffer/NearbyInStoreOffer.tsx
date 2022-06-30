import React, { memo } from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { BrandLogo } from '_components/BrandLogo';
import { inStoreOfferIsActivated } from '_utils/inStoreOfferIsActivated';
import { useTestingHelper } from '_utils/useTestingHelper';
import { ICardLinkOffer } from '_models/cardLink';
import { Icon } from '_commons/components/atoms/Icon';
import { COLOR, ICON, FONT_SIZE } from '_constants';
import RestaurantFallback from '_assets/in-store-offer/restaurantFallback.svg';

import { styles } from './styles';

export interface Props {
  offer: ICardLinkOffer;
  disabled: boolean;
  showStreet?: boolean;
  hideMiles?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

const NearbyInStoreOffer = ({ offer, disabled, showStreet, hideMiles, style, onPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('nearby-in-store-offer');
  const { brandName, brandLogo, offerId, merchant } = offer;
  const closeOfferIsActive = inStoreOfferIsActivated(offer);
  return (
    <TouchableOpacity {...getTestIdProps('item')} disabled={disabled} onPress={onPress}>
      <View key={offerId} style={[styles.container, style]} {...getTestIdProps('offer')}>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <BrandLogo image={brandLogo} size={40} Fallback={RestaurantFallback} />
          </View>
          <View style={{ flexDirection: showStreet ? 'column' : 'row' }}>
            <Text style={styles.title} numberOfLines={1}>
              {brandName}
            </Text>
            {showStreet && (
              <View style={styles.streetContainer}>
                <Icon name={ICON.LOCATION} color={COLOR.DARK_GRAY} size={FONT_SIZE.TINY} />
                <Text style={styles.subtitle} numberOfLines={1}>
                  {merchant.address?.street}
                </Text>
              </View>
            )}
          </View>
        </View>
        {!hideMiles && (
          <View style={styles.milesAwayContainer}>
            <View style={closeOfferIsActive && styles.milesAway}>
              <Text style={[styles.textMilesAway, closeOfferIsActive && styles.textMilesAwayActive]}>{merchant?.merchantDistance} miles away</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(NearbyInStoreOffer);

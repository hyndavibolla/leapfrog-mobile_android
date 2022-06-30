import React, { memo, useContext } from 'react';
import { StyleProp, Text, TouchableHighlight, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import RestaurantFallback from '_assets/in-store-offer/restaurantFallback.svg';
import { COLOR, CONTAINER_STYLE, ROUTES, ICON, FONT_SIZE } from '_constants';
import { Pill } from '_components/Pill';
import { BrandLogo } from '_components/BrandLogo';
import { Icon } from '_commons/components/atoms/Icon';
import { inStoreOfferIsActivated } from '_utils/inStoreOfferIsActivated';
import { useTestingHelper } from '_utils/useTestingHelper';
import { getMissionPointsAwardedText } from '_utils/getMissionPointsAwardedText';
import { ICardLinkOffer, InStoreOfferStatus } from '_models/cardLink';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { styles } from './styles';

export interface Props {
  offer: ICardLinkOffer;
  disabled: boolean;
  style?: StyleProp<ViewStyle>;
  onActivatePressed: () => void;
}

const InStoreOffer = ({ offer, disabled, style, onActivatePressed }: Props) => {
  const { deps } = useContext(GlobalContext);
  const { getTestIdProps } = useTestingHelper('in-store-offer');
  const { navigate } = useNavigation();
  const isActivated = inStoreOfferIsActivated(offer);
  if (!Object.values(InStoreOfferStatus).includes(offer.status)) {
    deps.logger.warn('In Store Offer has invalid status', { status: offer.status, offer });
  }

  const pointsAwardedText = getMissionPointsAwardedText(offer.pointsAwarded);
  if (!pointsAwardedText) {
    deps.logger.warn('In Store Offer has invalid points awarded', { pointsAwarded: offer.pointsAwarded, offer });
  }

  return (
    <TouchableOpacity {...getTestIdProps('item')} disabled={disabled} onPress={() => navigate(ROUTES.IN_STORE_OFFERS.OFFER_DETAIL, { offerId: offer.offerId })}>
      <View style={[CONTAINER_STYLE.shadow, styles.container, style]} {...getTestIdProps('container')}>
        <View style={styles.informationContainer}>
          <BrandLogo image={offer.brandLogo} size={45} Fallback={RestaurantFallback} />
          <View style={styles.dataContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {offer.brandName}
            </Text>
            <Pill textFallback={'Local Offer'} style={styles.pill} isDisabled={!isActivated}>
              {pointsAwardedText}
            </Pill>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight disabled={disabled || isActivated} onPress={onActivatePressed} underlayColor="transparent" {...getTestIdProps('button')}>
            <View style={isActivated ? styles.buttonActivated : styles.button}>
              {isActivated && <Icon name={ICON.TICK} color={COLOR.PURPLE} size={FONT_SIZE.PETITE} />}
              <Text style={isActivated ? styles.buttonTextActivated : styles.buttonText}>{isActivated ? 'Activated' : 'Activate'}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(InStoreOffer);

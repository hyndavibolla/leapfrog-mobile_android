import React, { memo } from 'react';
import { View, Text } from 'react-native';

import { styles } from './styles';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { Title, TitleType } from '../Title';
import { Button } from '../Button';
import CardIcon from '../../../assets/shared/cardIconDarkBlue.svg';
import RestaurantFallback from '../../../assets/in-store-offer/restaurantFallback.svg';
import { BrandLogo } from '../BrandLogo';

export interface Props {
  brandLogo?: string;
  brandName: string;
  onLinkCardPress?: () => void;
  onCancel?: () => void;
}

export const InStoreOfferLinkCardModalKey = 'in-store-offer-link-card-modal';

const InStoreOfferLinkCardModal = ({ brandLogo, brandName, onLinkCardPress, onCancel }: Props) => {
  const { getTestIdProps } = useTestingHelper(InStoreOfferLinkCardModalKey);
  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <View style={styles.header}>
        <CardIcon style={styles.brandIcon} />
        <Text style={styles.plus}>+</Text>
        <BrandLogo image={brandLogo} Fallback={RestaurantFallback} size={60} />
      </View>
      <Title style={styles.title} type={TitleType.HEADER}>
        To activate your {brandName} offer, link your card
      </Title>
      <View style={styles.body}>
        <Text style={styles.bodyText}>Please add a card to your account to start earning points at restaurants near you.</Text>
      </View>
      <Button innerContainerStyle={styles.linkBtnInnerContainer} textStyle={styles.linkBtnText} onPress={onLinkCardPress} {...getTestIdProps('link-card-btn')}>
        Link a Card
      </Button>
      <Button innerContainerStyle={styles.dismissBtnInnerContainer} textStyle={styles.dismissBtnText} onPress={onCancel} {...getTestIdProps('cancel-btn')}>
        Cancel
      </Button>
    </View>
  );
};

export default memo(InStoreOfferLinkCardModal);

import React, { memo, useCallback } from 'react';
import { View, Text } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { DateLike } from '_models/general';
import { getDateDiffInDays } from '_utils/getDateDiffInDays';
import RestaurantFallback from '_assets/in-store-offer/restaurantFallback.svg';
import { Icon } from '_commons/components/atoms/Icon';
import { ICON, FONT_SIZE, COLOR } from '_constants';
import { Button } from '_components/Button';
import { BrandLogo } from '_components/BrandLogo';
import { Title, TitleType } from '_components/Title';

import { styles } from './styles';

export interface Props {
  brandLogo?: string;
  brandName: string;
  activeUntil: DateLike;
  onActionPress: () => void;
  street: string;
}

export const InStoreOfferActivatedModalKey = 'in-store-offer-activated-modal';

const InStoreOfferActivatedModal = ({ brandLogo, brandName, activeUntil, onActionPress, street }: Props) => {
  const { getTestIdProps } = useTestingHelper(InStoreOfferActivatedModalKey);
  const diffDays = getDateDiffInDays(Date.now(), activeUntil);

  type ItemViewProps = { value: string; check?: boolean };
  const ItemView = useCallback(
    ({ value, check }: ItemViewProps) => (
      <View style={styles.listItem}>
        {check && <Icon name={ICON.TICK} color={COLOR.PURPLE} size={FONT_SIZE.PETITE} style={styles.listItemIcon} />}
        <Text style={styles.bodyText}>{value}</Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <View style={styles.header}>
        <BrandLogo image={brandLogo} Fallback={RestaurantFallback} size={60} />
        <Text style={styles.plus}>+</Text>
        <Icon name={ICON.OFFER_CIRCLE} color={COLOR.PURPLE} size={FONT_SIZE.XL} />
      </View>
      <Title style={styles.title} type={TitleType.HEADER}>
        Your {brandName} offer is activated!
      </Title>
      <View style={styles.body}>
        <Text style={styles.bodyText}>What do I do next?</Text>
        <View style={styles.list}>
          <ItemView value="Go to the restaurant" check />
          <ItemView value="Purchase food" check />
          <ItemView value="Enjoy! 🎉" />
        </View>
        {!isNaN(diffDays) && diffDays > 0 && (
          <Text style={styles.bodyText} {...getTestIdProps('text-diff-day')}>
            This offer is available for {diffDays} days{street ? ` for the restaurant at ${street}.` : '.'}
          </Text>
        )}
      </View>

      <Button innerContainerStyle={styles.linkBtnInnerContainer} textStyle={styles.linkBtnText} onPress={onActionPress} {...getTestIdProps('action-btn')}>
        Got it!
      </Button>
    </View>
  );
};

export default memo(InStoreOfferActivatedModal);

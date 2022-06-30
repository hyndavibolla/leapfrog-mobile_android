import React, { memo } from 'react';
import { View } from 'react-native';

import { Title } from '_components/Title';
import { DateLike } from '_models/general';
import { Icon } from '_commons/components/atoms/Icon';
import { Tag } from '_commons/components/atoms/Tag';
import { ICON, FONT_SIZE } from '_constants';

import { Pill } from '_components/Pill';

import styles from './styles';
import { useTestingHelper } from '_utils/useTestingHelper';
export interface Props {
  isActive: boolean;
  activeUntil: DateLike;
  name: string;
  rewardText: string;
}

function InStoreOfferDetailHeading({ isActive, name, rewardText }: Props) {
  const { getTestIdProps } = useTestingHelper('in-store-offer-heading');

  return (
    <View style={styles.header} {...getTestIdProps('container')}>
      <View style={styles.storeInfo}>
        <View style={styles.imageContainer}>
          <Icon name={ICON.FOOD_CIRCLE} size={FONT_SIZE.XL} />
        </View>
        <View style={styles.storeBrand}>
          <View style={styles.storeNameContainer}>
            <Title style={styles.storeName} numberOfLines={2}>
              {name}
            </Title>
          </View>

          <View style={styles.subtitleContainer}>
            <Pill textFallback={'Local Offer'} isDisabled={!isActive}>
              {rewardText}
            </Pill>
            <Tag children="Local Offer" />
          </View>
        </View>
      </View>
    </View>
  );
}

export default memo(InStoreOfferDetailHeading);

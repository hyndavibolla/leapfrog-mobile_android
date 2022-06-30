import React, { memo } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from '../Text';

import BrandFallback from '_assets/shared/loyaltyBrandFallback.svg';
import { Card } from '../Card';
import { styles } from './styles';
import { BrandLogo } from '../BrandLogo';
import { useTestingHelper } from '_utils/useTestingHelper';
import { FONT_FAMILY } from '_constants';
import { getBrandName } from '_utils/mapBrand';

export enum Orientation {
  HORIZONTAL,
  VERTICAL
}

export interface Props {
  image?: string;
  title?: string;
  orientation?: Orientation;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SmallGiftCard = ({ onPress, image, title, orientation = Orientation.HORIZONTAL, style }: Props) => {
  const { getTestIdProps } = useTestingHelper('small-gift-card');

  return (
    <TouchableOpacity onPress={onPress} {...getTestIdProps('container')}>
      <View style={styles.shadowContainer}>
        <Card style={[styles.container, orientation === Orientation.VERTICAL && styles.verticalContainer, style]}>
          <BrandLogo image={image} Fallback={BrandFallback} style={styles.logoImage} />
          <View
            style={[
              styles.giftDetails,
              orientation === Orientation.HORIZONTAL && styles.horizontalGiftDetails,
              orientation === Orientation.VERTICAL && styles.verticalGiftDetails
            ]}
          >
            <Text
              font={FONT_FAMILY.BOLD}
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[styles.brandName, orientation === Orientation.VERTICAL && styles.brandNameVertical]}
              {...getTestIdProps('brand-name')}
            >
              {getBrandName(title)}
            </Text>
          </View>
        </Card>
      </View>
    </TouchableOpacity>
  );
};

export default memo(SmallGiftCard);

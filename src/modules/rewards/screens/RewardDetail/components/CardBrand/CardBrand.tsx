import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { ImageBackground } from '_components/ImageBackground/ImageBackground';

import BrandFallback from '_assets/shared/loyaltyBrandFallback.svg';
import { BrandLogo } from '_components/BrandLogo';

import { styles } from './styles';

export interface Props {
  brandLogo: string;
  brandName: string;
  cardValue: string;
  faceplateUrl: string;
}

export const CardBrand = memo(({ brandLogo, brandName, cardValue, faceplateUrl }: Props) => {
  const { getTestIdProps } = useTestingHelper('card-brand');

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <ImageBackground containerStyle={styles.imageBackground} source={{ uri: faceplateUrl }}>
        {faceplateUrl ? null : <BrandLogo {...getTestIdProps('logo')} style={styles.logo} image={brandLogo} Fallback={BrandFallback} size={80} />}
      </ImageBackground>
      <View {...getTestIdProps('footer')} style={styles.footer}>
        <Text style={styles.brandName} numberOfLines={1} ellipsizeMode="tail">
          {brandName}
        </Text>
        <Text style={styles.cardValue}>{`$${cardValue}`}</Text>
      </View>
    </View>
  );
});

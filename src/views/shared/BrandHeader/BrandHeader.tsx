import React, { memo } from 'react';
import { View } from 'react-native';
import { Source } from 'react-native-fast-image';

import { ImageBackgroundWithFallback } from '../ImageBackgroundWithFallback';

import { styles } from './styles';
const defaultFallback = require('_assets/shared/imageBackgroundLarge.png');

export interface Props {
  uri: string;
  fallback?: Source;
}

export const BrandHeader = ({ uri, fallback = defaultFallback }: Props) => {
  return (
    <View style={styles.container}>
      <ImageBackgroundWithFallback containerStyle={styles.mainImage} source={{ uri }} fallbackSource={fallback} />
    </View>
  );
};

export default memo(BrandHeader);

import React, { memo } from 'react';
import { View } from 'react-native';
import { ResizeMode } from 'react-native-fast-image';

import { ImageBackgroundWithFallback } from '_components/ImageBackgroundWithFallback';
import { CONTAINER_STYLE } from '_constants';
import { styles } from './styles';

export interface Props {
  imageUrl: string;
  resizeMode?: ResizeMode;
}

const ImageCard = ({ imageUrl, resizeMode = 'cover' }: Props) => {
  return (
    <View style={styles.imageContainer}>
      <ImageBackgroundWithFallback
        containerStyle={[CONTAINER_STYLE.shadow, styles.backgroundContainer]}
        source={{ uri: imageUrl }}
        fallbackSource={require('_assets/shared/categoryBackgroundFallback.png')}
        resizeMode={resizeMode}
      />
    </View>
  );
};

export default memo(ImageCard);

import React, { memo } from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, View } from 'react-native';

import { styles } from './styles';
import { useTestingHelper } from '_utils/useTestingHelper';
import { Text } from '_components/Text';

import LocalOfferBannerBackground from '_assets/shared/localOfferBanner.svg';

export interface Props {
  onPress: () => void;
  title?: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
}

const LocalOfferBanner = ({ onPress, title, description, style }: Props) => {
  const { getTestIdProps } = useTestingHelper('local-offer-banner');

  const originalWidth = 317; // Original width of LocalOfferBannerBackground
  const originalHeight = 73; // Original height of LocalOfferBannerBackground
  const aspectRatio = originalWidth / originalHeight;

  return (
    <View style={[style]} {...getTestIdProps('container')}>
      {title && <Text style={styles.title}>{title}</Text>}
      <TouchableOpacity style={[styles.imageContainer, { aspectRatio }]} onPress={onPress} {...getTestIdProps('touchable')}>
        <LocalOfferBannerBackground width={'100%'} height={'100%'} viewBox={`0 0 ${originalWidth} ${originalHeight}`} />
      </TouchableOpacity>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
};

export default memo(LocalOfferBanner);

import React, { memo, useMemo } from 'react';
import { TouchableHighlight, View } from 'react-native';
import { ReactNativeStyle } from '@emotion/native';

import { CONTAINER_STYLE } from '_constants';
import { ImageBackgroundWithFallback } from '_components/ImageBackgroundWithFallback';
import { Text } from '_components/Text';
import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

export interface Props {
  title: string;
  backgroundUrl?: string;
  backgroundColor?: string;
  boxStyle?: ReactNativeStyle;
  onPress?: () => void;
  itemContainerStyle?: ReactNativeStyle;
  textStyle?: ReactNativeStyle;
}

export const MediumCategoryCard = ({ title, backgroundUrl, boxStyle, onPress, itemContainerStyle, textStyle }: Props) => {
  const { getTestIdProps } = useTestingHelper('medium-category-card');
  boxStyle = { ...styles.defaultBoxStyle, ...boxStyle };

  const containerStyle = useMemo(() => [CONTAINER_STYLE.shadow, styles.backgroundContainer, boxStyle], [boxStyle]);

  return (
    <TouchableHighlight underlayColor="transparent" onPress={onPress} {...getTestIdProps('container')}>
      {backgroundUrl ? (
        <ImageBackgroundWithFallback
          containerStyle={containerStyle}
          source={{ uri: backgroundUrl }}
          fallbackSource={require('_assets/shared/categoryBackgroundFallback.png')}
        >
          <View style={[styles.container, itemContainerStyle]}>
            <Text style={[styles.title, textStyle]} numberOfLines={2} ellipsizeMode="tail">
              {title}
            </Text>
          </View>
        </ImageBackgroundWithFallback>
      ) : (
        <View style={containerStyle}>
          <View style={[styles.container, itemContainerStyle]}>
            <Text style={[styles.title, textStyle]} numberOfLines={2} ellipsizeMode="tail">
              {title}
            </Text>
          </View>
        </View>
      )}
    </TouchableHighlight>
  );
};

export default memo(MediumCategoryCard);

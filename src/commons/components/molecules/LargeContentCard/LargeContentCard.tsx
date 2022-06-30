import React, { memo, ReactNode } from 'react';
import { ImageSourcePropType, TouchableHighlight, View, Image, ImageStyle } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { Text } from '_components/Text';

import { CONTAINER_STYLE } from '_constants/styles';

import { styles } from './styles';

export enum Theme {
  LIGHT,
  DARK
}

export interface Props {
  backgroundImage: ImageSourcePropType;
  title: string;
  description: string;
  children: ReactNode;
  theme?: Theme;
  onPress?: () => void;
}

export const LargeContentCard = ({ backgroundImage, onPress, title, description, children, theme = Theme.LIGHT }: Props) => {
  const { getTestIdProps } = useTestingHelper('large-content-card');

  const isDarkTheme = theme === Theme.DARK;

  return (
    <TouchableHighlight underlayColor="transparent" onPress={onPress} {...getTestIdProps('container')} style={[CONTAINER_STYLE.shadow, styles.container]}>
      <View>
        <Image source={backgroundImage} resizeMode="cover" style={[styles.backgroundImage, CONTAINER_STYLE.absoluteFill] as ImageStyle} />
        <View style={styles.imageContent}>
          <Text style={[styles.title, isDarkTheme ? styles.dark : styles.light]} {...getTestIdProps('title')}>
            {title}
          </Text>
          <Text style={[styles.description, isDarkTheme ? styles.dark : styles.light]} numberOfLines={2} {...getTestIdProps('subtitle')}>
            {description}
          </Text>
          {children}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default memo(LargeContentCard);

import React, { ReactNode, memo, useMemo } from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import { ReactNativeStyle } from '@emotion/native';

import { FONT_SIZE, COLOR, ICON } from '_constants';
import { Icon } from '_commons/components/atoms/Icon';
import { Card } from '_components/Card';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export enum RewardCardTheme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface Props {
  image: ReactNode;
  title: string;
  description: string;
  theme?: RewardCardTheme;
  color?: string;
  onPress?: () => void;
  isImageOnLeft?: boolean;
  containerStyles?: ReactNativeStyle;
  titleStyles?: ReactNativeStyle;
  descriptionStyles?: ReactNativeStyle;
  anchorStyles?: ReactNativeStyle;
}

export const RewardCard = ({
  onPress,
  image,
  title,
  description,
  theme = RewardCardTheme.LIGHT,
  color,
  isImageOnLeft = false,
  containerStyles,
  titleStyles,
  descriptionStyles,
  anchorStyles
}: Props) => {
  const { getTestIdProps } = useTestingHelper('reward-card');

  const themeMap = useMemo(
    () => ({
      [RewardCardTheme.DARK]: {
        content: color ? { backgroundColor: color } : styles.darkBackground,
        text: styles.whiteText,
        Arrow: <Icon name={ICON.ARROW_RIGHT} size={FONT_SIZE.SMALLER} color={COLOR.WHITE} />
      },
      [RewardCardTheme.LIGHT]: {
        content: color ? { backgroundColor: color } : styles.whiteBackground,
        text: {},
        Arrow: <Icon name={ICON.ARROW_RIGHT} size={FONT_SIZE.SMALLER} />
      }
    }),
    [color]
  );

  const dynamicStyles = useMemo(() => {
    return StyleSheet.create({
      rowContainer: {
        ...styles.rowContainer,
        flexDirection: isImageOnLeft ? 'row-reverse' : 'row'
      }
    });
  }, [isImageOnLeft]);

  const themeStyles = themeMap[theme];
  return (
    <TouchableHighlight underlayColor="transparent" onPress={onPress} {...getTestIdProps('container')}>
      <Card style={[styles.container, containerStyles]}>
        <View style={[styles.content, themeStyles.content]}>
          <View style={dynamicStyles.rowContainer}>
            <View style={styles.infoContainer}>
              <View>
                <Text style={[styles.title, themeStyles.text, titleStyles]} numberOfLines={1} ellipsizeMode="tail">
                  {title}
                </Text>
                <Text style={[styles.descriptionText, themeStyles.text, descriptionStyles]} numberOfLines={2} ellipsizeMode="tail">
                  {description}
                </Text>
              </View>
              <View style={styles.anchorContainer}>
                <Text style={[styles.anchorText, themeStyles.text, anchorStyles]}>Let's go!</Text>
                {themeStyles.Arrow}
              </View>
            </View>
            <View style={styles.logoContainer}>
              <Grayscale amount={0}>{image}</Grayscale>
            </View>
          </View>
        </View>
      </Card>
    </TouchableHighlight>
  );
};

export default memo(RewardCard);

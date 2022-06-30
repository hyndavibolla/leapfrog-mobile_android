import React, { memo } from 'react';
import LottieView from 'lottie-react-native';
import { View, Text, StyleProp, ViewStyle } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

export interface Props {
  text?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const Loading = ({ text, size = 35, style }: Props) => {
  const { getTestIdProps } = useTestingHelper('loading');

  return (
    <View style={[styles.loadingContainer, style]} {...getTestIdProps('container')}>
      <LottieView style={{ width: size, height: size }} loop autoPlay source={require('_assets/spinner/spinner-loader.json')} />
      {text ? (
        <View style={styles.loadingTextContainer}>
          <Text style={styles.loadingText}>{text}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default memo(Loading);

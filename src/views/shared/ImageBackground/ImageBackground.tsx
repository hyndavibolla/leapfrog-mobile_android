import React, { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Image, { FastImageProps } from 'react-native-fast-image';

import { useTestingHelper } from '_utils/useTestingHelper';

export interface Props extends FastImageProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export const ImageBackground = ({ containerStyle, style, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('image-background');
  const { width, height } = StyleSheet.flatten(containerStyle) ?? {};

  return (
    <View style={containerStyle} {...getTestIdProps('container')}>
      <Image {...props} style={[StyleSheet.absoluteFill, { width, height }, style]} {...getTestIdProps('image')} />
    </View>
  );
};

export default memo(ImageBackground);

import React, { memo } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

import { styles } from './styles';

export interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  lineStyle?: StyleProp<ViewStyle>;
}

export const Divider = ({ containerStyle, lineStyle }: Props) => {
  return (
    <View style={[styles.containerGeneral, containerStyle]}>
      <View style={[styles.separator, lineStyle]} />
    </View>
  );
};

export default memo(Divider);

import React, { memo, PropsWithChildren, useMemo } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

import { CONTAINER_STYLE } from '../../../constants';
import { styles } from './styles';

export interface Props {
  style?: StyleProp<ViewStyle>;
  hideShadow?: boolean;
}

export const Card = ({ children, style = {}, hideShadow }: PropsWithChildren<Props>) => {
  const containerStyle = useMemo(() => [!hideShadow && CONTAINER_STYLE.shadow, styles.container, style], [style, hideShadow]);

  return <View style={containerStyle}>{children}</View>;
};

export default memo(Card);

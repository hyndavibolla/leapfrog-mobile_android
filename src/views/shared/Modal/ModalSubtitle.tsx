import React, { PropsWithChildren, memo } from 'react';
import { Text, TextStyle } from 'react-native';

import { styles } from './styles';

type ModalSubtitleProps = {
  style?: TextStyle;
};

const ModalSubtitle = ({ children, style }: PropsWithChildren<ModalSubtitleProps>) => {
  return <Text style={[styles.subtitle, style]}>{children}</Text>;
};

export default memo(ModalSubtitle);

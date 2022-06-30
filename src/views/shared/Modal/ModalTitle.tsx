import React, { PropsWithChildren, memo } from 'react';
import { Text, TextStyle } from 'react-native';

import { styles } from './styles';

type ModalTitleProps = {
  style?: TextStyle;
};

const ModalTitle = ({ children, style }: PropsWithChildren<ModalTitleProps>) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

export default memo(ModalTitle);

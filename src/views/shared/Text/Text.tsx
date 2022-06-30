import React, { memo, ReactNode } from 'react';
import { TextProps } from 'react-native';

import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants';

import { StyledText } from './styles';

export interface Props extends TextProps {
  color?: COLOR;
  font?: FONT_FAMILY;
  size?: FONT_SIZE;
  lineHeight?: LINE_HEIGHT;
  children: ReactNode;
}

const Text = ({ color, font, size, lineHeight, children, ...otherProps }: Props) => {
  return (
    <StyledText color={color} font={font} size={size} lineHeight={lineHeight} {...otherProps}>
      {children}
    </StyledText>
  );
};

export default memo(Text);

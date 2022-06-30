import React, { memo, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';

import icoMoonConfig from './selection.json';
import { FONT_SIZE, COLOR, ICON } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';

export interface Props {
  name: ICON;
  size?: FONT_SIZE;
  color?: COLOR;
  backgroundStyle?: StyleProp<ViewStyle>;
  innerBackgroundStyle?: StyleProp<ViewStyle>;
  [x: string]: unknown;
}

const CustomIcon = createIconSetFromIcoMoon(icoMoonConfig);

const Icon = ({ name, size = FONT_SIZE.REGULAR, color = COLOR.PRIMARY_BLUE, backgroundStyle, innerBackgroundStyle, ...rest }: Props) => {
  const { getTestIdProps } = useTestingHelper('icon');
  const parsedSize = Number.parseInt(size.replace('px', ''), 10);

  const customIcon = useMemo(
    () => <CustomIcon name={name} color={color} size={parsedSize} {...getTestIdProps('text')} {...rest} />,
    [color, getTestIdProps, name, parsedSize, rest]
  );

  // Normal Icon
  if (typeof backgroundStyle === 'undefined') return customIcon;

  // Icon with background
  return (
    <View
      style={[
        {
          borderRadius: parsedSize,
          width: parsedSize * 1.75,
          height: parsedSize * 1.75,
          justifyContent: 'center',
          alignItems: 'center'
        },
        backgroundStyle
      ]}
    >
      <View style={innerBackgroundStyle}>{customIcon}</View>
    </View>
  );
};

export default memo(Icon);

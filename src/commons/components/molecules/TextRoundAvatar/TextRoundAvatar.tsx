import React, { memo } from 'react';
import { TextStyle, View } from 'react-native';

import { Text } from '_components/Text';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants/styles';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props {
  value: string;
  textSize?: FONT_SIZE;
  color?: COLOR;
  font?: FONT_FAMILY;
  size?: number;
  backgroundColor?: COLOR;
  style?: TextStyle;
}

const TextRoundAvatar = ({ value, textSize, color, font, size, backgroundColor, style }: Props) => {
  const { getTestIdProps } = useTestingHelper('text-round-avatar');
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor ?? COLOR.MEDIUM_GRAY,
          height: size ?? 36,
          width: size ?? 36
        },
        style
      ]}
      {...getTestIdProps('container')}
    >
      <Text
        color={color ?? COLOR.BLACK}
        font={font ?? FONT_FAMILY.MEDIUM}
        size={textSize ?? FONT_SIZE.REGULAR}
        style={styles.text}
        {...getTestIdProps('value')}
      >
        {value}
      </Text>
    </View>
  );
};

export default memo(TextRoundAvatar);

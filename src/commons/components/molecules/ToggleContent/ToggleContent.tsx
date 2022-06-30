import React, { memo, ReactNode, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Icon } from '_commons/components/atoms/Icon';
import { Text } from '_components/Text';
import { ICON } from '_constants/icons';
import { COLOR, FONT_SIZE } from '_constants/styles';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props {
  title: string;
  titleColor?: COLOR;
  titleSize?: FONT_SIZE;
  children: ReactNode;
}

const ToggleContent = ({ title, titleColor = COLOR.BLACK, titleSize = FONT_SIZE.MEDIUM, children }: Props) => {
  const { getTestIdProps } = useTestingHelper('toggle');
  const [showContent, setShowContent] = useState<boolean>(true);

  const onPress = () => {
    setShowContent(!showContent);
  };

  return (
    <>
      <View style={styles.header}>
        <Text color={titleColor} size={titleSize} {...getTestIdProps('title')}>
          {title}
        </Text>
        <TouchableOpacity onPress={onPress} {...getTestIdProps('button')}>
          <Icon name={showContent ? ICON.BRACKET_UP : ICON.BRACKET_DOWN} color={titleColor} size={titleSize} />
        </TouchableOpacity>
      </View>
      {showContent && children}
    </>
  );
};

export default memo(ToggleContent);

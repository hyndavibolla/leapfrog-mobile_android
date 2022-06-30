import React, { memo } from 'react';
import { View, Text } from 'react-native';

import { Icon } from '_commons/components/atoms/Icon';
import { Theme } from '_commons/components/molecules/LargeContentCard';
import { COLOR, FONT_SIZE, ICON } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

export interface Props {
  title: string;
  icon: ICON;
  theme?: Theme;
}

const ButtonCTA = ({ title, theme = Theme.LIGHT, icon }: Props) => {
  const { getTestIdProps } = useTestingHelper('button-cta');
  const isLightTheme = theme === Theme.LIGHT;

  return (
    <View style={[styles.ctaButtonContainer, { backgroundColor: isLightTheme ? COLOR.WHITE : COLOR.PRIMARY_BLUE }]} {...getTestIdProps('container')}>
      <Text style={[styles.ctaButtonContent, { color: isLightTheme ? COLOR.PRIMARY_BLUE : COLOR.WHITE }]} {...getTestIdProps('title')}>
        {title}
      </Text>
      <Icon name={icon} size={FONT_SIZE.SMALLER} color={isLightTheme ? COLOR.PRIMARY_BLUE : COLOR.WHITE} />
    </View>
  );
};

export default memo(ButtonCTA);

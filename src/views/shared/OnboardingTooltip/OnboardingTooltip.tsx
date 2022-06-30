import React from 'react';
import { View } from 'react-native';

import { Title, TitleType } from '_components/Title';
import { Text } from '_components/Text';

import { TooltipButton } from '_components/TooltipButton';
import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

export interface Props {
  onPress: () => void;
  isFlashy: boolean;
  title: string;
  subtitle?: string;
}

export const OnboardingTooltip = ({ title, subtitle, onPress, isFlashy }: Props) => {
  const { getTestIdProps } = useTestingHelper('onboarding-tooltip');

  return (
    <View {...getTestIdProps('container')}>
      <Title type={TitleType.HEADER} style={styles.title}>
        {title}
      </Title>
      <View style={styles.buttonContainer}>
        <TooltipButton flashy={isFlashy} altInactive onPress={onPress} />
      </View>
      {subtitle && <Text {...getTestIdProps('subtitle')}>{subtitle}</Text>}
    </View>
  );
};

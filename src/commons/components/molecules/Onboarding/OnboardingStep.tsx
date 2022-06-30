import React, { memo } from 'react';
import { Dimensions, View } from 'react-native';
import LottieView from 'lottie-react-native';

import { useTestingHelper } from '_utils/useTestingHelper';

import { Text } from '_components/Text';
import { IStep } from '_commons/components/molecules/Onboarding';

import { styles } from './styles';

export interface Props {
  step: IStep;
  testId: string;
}

const OnboardingStep = ({ step: { animation, subtitle, title, description, backgroundColor, sectionColor }, testId }: Props) => {
  const windowWidth = Dimensions.get('window').width;

  const { getTestIdProps } = useTestingHelper('onboarding-step');

  return (
    <View style={[styles.stepContainer, { width: windowWidth, backgroundColor: backgroundColor }]} {...getTestIdProps(testId)}>
      <View style={[styles.lottieContainer, { width: windowWidth }]}>
        <LottieView source={animation} autoPlay />
      </View>

      <View style={styles.bottomDrawer}>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: sectionColor }]} {...getTestIdProps('subtitle')}>
            {subtitle}
          </Text>
        ) : null}
        <Text style={styles.title}>{title}</Text>

        <View style={styles.description}>{typeof description === 'string' ? <Text style={styles.descriptionText}>{description}</Text> : description}</View>
      </View>
    </View>
  );
};

export default memo(OnboardingStep);

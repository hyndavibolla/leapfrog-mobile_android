import React, { memo, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';

import OnboardingStep from '_commons/components/molecules/Onboarding/OnboardingStep';

import { useTestingHelper } from '_utils/useTestingHelper';

import { COLOR, TealiumEventType } from '_constants';

import { styles } from './styles';

export interface IStep {
  title: string;
  animation: string;
  description: ReactNode;
  sectionColor: string;
  backgroundColor: string;
  subtitle?: string;
  buttonLabel: string;
}
export interface IEvent {
  trackingRouteName: string;
  trackingSuccess: TealiumEventType;
  trackingCancel: TealiumEventType;
}

export interface Props {
  steps: IStep[];
  onNextPress: (number) => void;
  onSkipPress: (number) => void;
  onChangeStep?: (number) => void;
}

function Onboarding({ steps, onNextPress, onSkipPress, onChangeStep }: Props) {
  const scrollRef = useRef<ScrollView>();
  const windowWidth = Dimensions.get('window').width;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const isLastStep = currentStep === steps.length - 1;

  const { getTestIdProps } = useTestingHelper('onboarding');

  useEffect(() => {
    if (!onChangeStep) return;
    onChangeStep(currentStep);
  }, [currentStep, onChangeStep]);

  const handleNextPress = useCallback(() => {
    scrollRef.current?.scrollTo({
      y: 0,
      x: (currentStep + 1) * windowWidth,
      animated: true
    });
    onNextPress(currentStep);
  }, [currentStep, onNextPress, windowWidth]);

  return (
    <View style={styles.onboardingContainer}>
      <View style={styles.topContainer}>
        {!isLastStep ? (
          <Pressable onPress={() => onSkipPress(currentStep)} style={styles.skipButton} {...getTestIdProps('skip-btn')}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: `${100 * steps.length}%` }}
        scrollEventThrottle={200}
        onScroll={({
          nativeEvent: {
            contentOffset: { x }
          }
        }) => {
          setCurrentStep(Math.round(x / windowWidth));
        }}
        {...getTestIdProps('scrollView')}
      >
        {steps.map((step, index) => (
          <OnboardingStep key={index} step={step} testId={`${index}-${index === currentStep ? 'active' : 'inactive'}`} />
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.positionIndicatorContainer}>
          {steps.map((_step, index) => {
            return (
              <View
                key={index}
                style={[
                  styles.positionIndicator,
                  {
                    backgroundColor: currentStep === index ? COLOR.PRIMARY_BLUE : COLOR.MEDIUM_GRAY
                  }
                ]}
              />
            );
          })}
        </View>
        <Pressable style={styles.mainButton} onPress={handleNextPress} {...getTestIdProps('next-btn')}>
          <Text style={styles.mainButtonText} {...getTestIdProps('next-btn-label')}>
            {steps[currentStep].buttonLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default memo(Onboarding);

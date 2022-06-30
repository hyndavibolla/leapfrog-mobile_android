import React from 'react';
import { View, Alert, Dimensions } from 'react-native';

import { Text } from '_components/Text';
import { COLOR } from '_constants';

import { styles } from '../styles';
import { IStep, Onboarding } from '_commons/components/molecules/Onboarding';
import { Pill } from '_components/Pill';

const descriptionPills = (
  <>
    <Pill textFallback={'Mission'} style={{ marginRight: 10 }} />
    <Pill textFallback={'Local Offer'} />
  </>
);

const steps: IStep[] = [
  {
    title: 'Earn points on every purchase made on the MAX app or via linked cards.',
    description: descriptionPills,
    animation: require('_assets/animations/rewards/1'),
    backgroundColor: '#FFEDFB',
    sectionColor: COLOR.PRIMARY_BLUE,
    buttonLabel: 'Continue'
  },
  {
    title: 'What are MAX Missions?',
    subtitle: 'Shop Your Way Max® missions',
    description: 'MAX Missions reward members with bonus Shop Your Way® points for completing Mission-eligible purchases.',
    animation: require('_assets/animations/rewards/1'),
    backgroundColor: '#DBE5F3',
    sectionColor: COLOR.PRIMARY_BLUE,
    buttonLabel: 'Continue'
  },
  {
    title: 'Reward yourself with the things you love.',
    subtitle: 'SHOP YOUR WAY MAX® MISSIONS',
    description: 'Pick a brand, then pick a gift card with your MAX Points and/or a credit card. Once purchased, the card(s) will be sent to your email.',
    animation: require('_assets/animations/rewards/1'),
    backgroundColor: '#E8C9D4',
    sectionColor: COLOR.PINK,
    buttonLabel: 'Continue'
  }
];

const windowWidth = Dimensions.get('window').width;

export const OnboardingStory = () => (
  <View style={{ width: windowWidth, marginLeft: -10 }}>
    <Text style={styles.title}>Section onboarding</Text>
    <View style={{ width: windowWidth }}>
      <Onboarding steps={steps} onNextPress={() => Alert.alert('onNext')} onSkipPress={() => Alert.alert('onSkipPress')} />
    </View>
  </View>
);

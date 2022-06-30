import React, { useContext, useCallback } from 'react';
import { Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Onboarding, IStep, IEvent } from '_commons/components/molecules/Onboarding';
import { Pill } from '_components/Pill';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useEventTracker, useOnboarding } from '_state_mgmt/core/hooks';

import { getPageNameByRoute } from '_utils/trackingUtils';
import { COLOR, FONT_SIZE, ForterActionType, ROUTES, TealiumEventType } from '_constants';

import { styles } from './styles';

const steps: IStep[] = [
  {
    title: 'Earn points on every purchase made on the MAX app or via linked cards',
    description: (
      <View style={styles.descriptionContainer}>
        <Pill iconSize={FONT_SIZE.BIG} style={styles.pillContainer}>
          1000
        </Pill>
        <Text style={styles.customText}> = $1 USD</Text>
      </View>
    ),
    animation: require('_assets/animations/onboarding/1'),
    backgroundColor: COLOR.SOFT_PRIMARY_BLUE,
    sectionColor: COLOR.PINK,
    buttonLabel: 'Continue'
  },
  {
    title: 'Earn even more with Missions and Local restaurant offers.',
    description: (
      <View style={styles.descriptionContainer}>
        <Pill textFallback={'Mission'} iconSize={FONT_SIZE.BIG} style={styles.pillContainer} />
        <Pill textFallback={'Local Offer'} iconSize={FONT_SIZE.BIG} style={styles.pillContainer} />
      </View>
    ),
    animation: require('_assets/animations/onboarding/2'),
    backgroundColor: COLOR.SOFT_PINK,
    sectionColor: COLOR.PINK,
    buttonLabel: 'Continue'
  },
  {
    title: 'Redeem your points for gift cards at brands you use everyday.',
    description: (
      <View style={styles.descriptionContainer}>
        <Pill iconSize={FONT_SIZE.BIG} style={styles.pillContainer}>
          Rewards
        </Pill>
      </View>
    ),
    animation: require('_assets/animations/onboarding/3'),
    backgroundColor: COLOR.SOFT_GREEN,
    sectionColor: COLOR.PINK,
    buttonLabel: 'Start Now'
  }
];

const events: IEvent[] = [
  {
    trackingRouteName: ROUTES.TOOLTIP.ONBOARDING_STEP_1,
    trackingSuccess: TealiumEventType.ONBOARDING_STEP_1_SUCCESS,
    trackingCancel: TealiumEventType.ONBOARDING_STEP_1_CANCEL
  },
  {
    trackingRouteName: ROUTES.TOOLTIP.ONBOARDING_STEP_2,
    trackingSuccess: TealiumEventType.ONBOARDING_STEP_2_SUCCESS,
    trackingCancel: TealiumEventType.ONBOARDING_STEP_2_CANCEL
  },
  {
    trackingRouteName: ROUTES.TOOLTIP.ONBOARDING_STEP_3,
    trackingSuccess: TealiumEventType.ONBOARDING_STEP_3_SUCCESS,
    trackingCancel: TealiumEventType.ONBOARDING_STEP_3_CANCEL
  }
];

export interface Props {
  navigation: StackNavigationProp<any>;
}

function AppOnboarding({ navigation }: Props) {
  const { trackUserEvent, trackView } = useEventTracker();
  const {
    state: {
      user: { currentUser }
    }
  } = useContext(GlobalContext);
  const {
    setOnboarding: [onSetOnboarding]
  } = useOnboarding();

  const handleNextPress = useCallback(
    async currentStep => {
      trackUserEvent(
        events[currentStep].trackingSuccess,
        {
          page_name: getPageNameByRoute(events[currentStep]?.trackingRouteName)
        },
        ForterActionType.TAP
      );
      if (currentStep === steps.length - 1) {
        await onSetOnboarding(true);
        navigation.navigate(currentUser?.personal.sywMemberNumber ? ROUTES.MAIN : ROUTES.LOGIN);
      }
    },
    [trackUserEvent, onSetOnboarding, navigation, currentUser?.personal.sywMemberNumber]
  );

  const handleSkipPress = useCallback(
    currentStep => {
      trackUserEvent(
        events[currentStep].trackingCancel,
        {
          page_name: getPageNameByRoute(events[currentStep]?.trackingRouteName)
        },
        ForterActionType.TAP
      );
      navigation.navigate(currentUser?.personal.sywMemberNumber ? ROUTES.MAIN : ROUTES.LOGIN);
    },
    [currentUser?.personal.sywMemberNumber, navigation, trackUserEvent]
  );

  const handleChangeStep = useCallback(
    currentStep => {
      trackView(events[currentStep].trackingRouteName);
    },
    [trackView]
  );

  return <Onboarding steps={steps} onChangeStep={handleChangeStep} onNextPress={handleNextPress} onSkipPress={handleSkipPress} />;
}

export default AppOnboarding;

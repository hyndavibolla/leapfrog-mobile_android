import React, { useCallback } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

import { IEvent, IStep, Onboarding } from '_commons/components/molecules/Onboarding';

import { useEventTracker, useTooltipList } from '_state_mgmt/core/hooks';
import { TooltipKey } from '_models/general';

import { COLOR, ForterActionType, ROUTES, TealiumEventType } from '_constants';
import { getPageNameByRoute } from '_utils/trackingUtils';

const steps: IStep[] = [
  {
    title: 'Use your points with gift cards redeemed on MAX',
    subtitle: 'SHOP YOUR WAY MAX® rewards',
    description: 'Points can be redeemed in the MAX app on gift cards or on Shopyourway.com with the  brands you already love.',
    animation: require('_assets/animations/rewards/1'),
    backgroundColor: COLOR.SOFT_PINK,
    sectionColor: COLOR.PINK,
    buttonLabel: 'Continue'
  },
  {
    title: 'Reward yourself with the things you love',
    subtitle: 'SHOP YOUR WAY MAX® REWARDS',
    description: 'Pick a brand, then pick a gift card with your MAX Points and/or a credit card. Once purchased, the card(s) will be sent to your email.',
    animation: require('_assets/animations/rewards/2'),
    backgroundColor: COLOR.SOFT_PINK,
    sectionColor: COLOR.PINK,
    buttonLabel: 'Got it!'
  }
];

const events: IEvent[] = [
  {
    trackingRouteName: ROUTES.TOOLTIP.REWARDS_STEP_1,
    trackingSuccess: TealiumEventType.REWARD_TOOLTIP_STEP_1_SUCCESS,
    trackingCancel: TealiumEventType.REWARD_TOOLTIP_STEP_1_CANCEL
  },
  {
    trackingRouteName: ROUTES.TOOLTIP.REWARDS_STEP_2,
    trackingSuccess: TealiumEventType.REWARD_TOOLTIP_STEP_2_SUCCESS,
    trackingCancel: TealiumEventType.REWARD_TOOLTIP_STEP_2_CANCEL
  }
];

export interface Props {
  navigation: StackNavigationProp<any>;
}

function RewardsOnboarding({ navigation }: Props) {
  const { trackUserEvent, trackView } = useEventTracker();
  const { setViewedTooltipList } = useTooltipList();
  const [onSetTooltipList] = setViewedTooltipList;

  const handleNextPress = useCallback(
    currentStep => {
      trackUserEvent(
        events[currentStep].trackingSuccess,
        {
          page_name: getPageNameByRoute(events[currentStep]?.trackingRouteName)
        },
        ForterActionType.TAP
      );
      if (currentStep === steps.length - 1) {
        onSetTooltipList(TooltipKey.REWARDS);
        navigation.goBack();
      }
    },
    [navigation, onSetTooltipList, trackUserEvent]
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
      navigation.goBack();
    },
    [navigation, trackUserEvent]
  );

  const handleChangeStep = useCallback(
    currentStep => {
      trackView(events[currentStep].trackingRouteName);
    },
    [trackView]
  );

  return <Onboarding steps={steps} onChangeStep={handleChangeStep} onNextPress={handleNextPress} onSkipPress={handleSkipPress} />;
}

export default RewardsOnboarding;

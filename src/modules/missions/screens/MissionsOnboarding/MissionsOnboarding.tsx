import React, { useCallback } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

import { Onboarding, IEvent, IStep } from '_commons/components/molecules/Onboarding';

import { useEventTracker, useTooltipList } from '_state_mgmt/core/hooks';
import { TooltipKey } from '_models/general';

import { COLOR, ForterActionType, ROUTES, TealiumEventType } from '_constants';
import { getPageNameByRoute } from '_utils/trackingUtils';

const steps: IStep[] = [
  {
    title: 'What are MAX Missions?',
    subtitle: 'SHOP YOUR WAY MAX® MISSIONS',
    description: 'MAX Missions reward members with bonus Shop Your Way® points for completing Mission-eligible purchases.',
    animation: require('_assets/animations/missions/1'),
    backgroundColor: COLOR.SOFT_PRIMARY_BLUE,
    sectionColor: COLOR.PRIMARY_BLUE,
    buttonLabel: 'Continue'
  },
  {
    title: 'How do Missions work?',
    subtitle: 'SHOP YOUR WAY MAX® MISSIONS',
    description:
      'Complete eligible purchases through MAX. We’ll keep your eligible purchases synced with MAX and let you know as you make progress on your Mission!',
    animation: require('_assets/animations/missions/2'),
    backgroundColor: COLOR.SOFT_PRIMARY_BLUE,
    sectionColor: COLOR.PRIMARY_BLUE,
    buttonLabel: 'Continue'
  },
  {
    title: 'Live! Spend! Get rewarded!',
    subtitle: 'SHOP YOUR WAY MAX® MISSIONS',
    description:
      '🔑 Every Mission has unique purchase and timing requirements. The longer the Mission, the larger the reward! Make sure to check in often to complete',
    animation: require('_assets/animations/missions/3'),
    backgroundColor: COLOR.SOFT_PRIMARY_BLUE,
    sectionColor: COLOR.PRIMARY_BLUE,
    buttonLabel: 'Got it!'
  }
];

const events: IEvent[] = [
  {
    trackingRouteName: ROUTES.TOOLTIP.MISSIONS_STEP_1,
    trackingSuccess: TealiumEventType.MISSIONS_TOOLTIP_STEP_1_SUCCESS,
    trackingCancel: TealiumEventType.MISSIONS_TOOLTIP_STEP_1_CANCEL
  },
  {
    trackingRouteName: ROUTES.TOOLTIP.MISSIONS_STEP_2,
    trackingSuccess: TealiumEventType.MISSIONS_TOOLTIP_STEP_2_SUCCESS,
    trackingCancel: TealiumEventType.MISSIONS_TOOLTIP_STEP_2_CANCEL
  },
  {
    trackingRouteName: ROUTES.TOOLTIP.MISSIONS_STEP_3,
    trackingSuccess: TealiumEventType.MISSIONS_TOOLTIP_STEP_3_SUCCESS,
    trackingCancel: TealiumEventType.MISSIONS_TOOLTIP_STEP_3_CANCEL
  }
];

export interface Props {
  navigation: StackNavigationProp<any>;
}

function MissionsOnboarding({ navigation }: Props) {
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
        onSetTooltipList(TooltipKey.MISSIONS);
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

export default MissionsOnboarding;

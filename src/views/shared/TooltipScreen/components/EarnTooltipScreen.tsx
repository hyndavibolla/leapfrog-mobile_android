import React, { memo, useCallback, useMemo } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

import { TooltipScreen } from '../TooltipScreen';
import { useTooltipList } from '../../../../state-mgmt/core/hooks';
import { TooltipKey } from '../../../../models/general';
import { ROUTES, TealiumEventType } from '../../../../constants';

interface RouteParams {
  params: {
    step: string;
  };
}
export interface Props {
  navigation: StackNavigationProp<any>;
  route: RouteParams;
}

export const EarnTooltipScreen = ({ navigation, route }: Props) => {
  const { setViewedTooltipList } = useTooltipList();
  const [onSetTooltipList] = setViewedTooltipList;
  const stepList = useMemo(
    () => [
      {
        title: "It's time to maximize your everyday spending.",
        subtitle: 'SHOP YOUR WAY OFFERS',
        text: 'MAX is full of great offers from popular brands so you can earn points each day of the week. Highly-curated offers just for you to earn more points at your favorite brands.',
        imageSrc: require('../../../../assets/tooltip/earn-1.png'),
        trackingRouteName: ROUTES.TOOLTIP.EARN_STEP_1,
        trackingSuccess: TealiumEventType.EARN_TOOLTIP_STEP_1_SUCCESS,
        trackingCancel: TealiumEventType.EARN_TOOLTIP_STEP_1_CANCEL
      },
      {
        title: 'Earn points on almost everything!',
        subtitle: 'SHOP YOUR WAY OFFERS',
        text: "You make purchases on our partner's digital stores, and we send you points according to your spending. Simple, right?\n\nIn order to earn points, purchases need to begin in the Shop Your Way MAX app.",
        imageSrc: require('../../../../assets/tooltip/earn-3.png'),
        trackingRouteName: ROUTES.TOOLTIP.EARN_STEP_2,
        trackingSuccess: TealiumEventType.EARN_TOOLTIP_STEP_2_SUCCESS,
        trackingCancel: TealiumEventType.EARN_TOOLTIP_STEP_2_CANCEL
      }
    ],
    []
  );

  const onComplete = useCallback(() => {
    onSetTooltipList(TooltipKey.EARN);
    navigation.goBack();
  }, [onSetTooltipList]); // eslint-disable-line react-hooks/exhaustive-deps

  return <TooltipScreen stepList={stepList} onComplete={onComplete} step={+route.params?.step - 1 || 0} />;
};

export default memo(EarnTooltipScreen);

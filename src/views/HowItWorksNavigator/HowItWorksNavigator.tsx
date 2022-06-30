import React, { memo } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { ConnectionBanner } from '../shared/ConnectionBanner';
import { ROUTES, NAVIGATOR_TAB, COLOR } from '../../constants';
import { HowItWorksPoints } from '../HowItWorksPoints';
import { Faq } from '../Faq';
import { useTestingHelper } from '../../utils/useTestingHelper';

const { Navigator, Screen } = createMaterialTopTabNavigator();

export const HowItWorksNavigator = () => {
  const { getTestIdProps } = useTestingHelper('how-it-works-navigator');
  return (
    <>
      <ConnectionBanner />
      <Navigator
        tabBarOptions={{
          labelStyle: NAVIGATOR_TAB.label,
          indicatorStyle: NAVIGATOR_TAB.indicator,
          activeTintColor: COLOR.PRIMARY_BLUE,
          inactiveTintColor: COLOR.DARK_GRAY,
          allowFontScaling: false
        }}
      >
        <Screen name={ROUTES.HOW_IT_WORKS.POINTS} component={HowItWorksPoints} {...getTestIdProps('points-link')} options={{ title: 'Points' }} />
        <Screen name={ROUTES.HOW_IT_WORKS.FAQ} component={Faq} {...getTestIdProps('faq-link')} options={{ title: 'FAQ' }} />
      </Navigator>
    </>
  );
};

export default memo(HowItWorksNavigator);

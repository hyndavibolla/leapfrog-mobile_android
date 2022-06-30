import React, { memo, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';

import { ROUTES } from '_constants';
import { ConnectionBanner } from '_components/ConnectionBanner';
import { EarnMain } from '_modules/earn/screens/EarnMain';
import { WalletMain } from '_views/WalletMain';
import { EnvBanner } from '_views/shared/EnvBanner';
import { Header } from '_components/Header';
import { StreakMain } from '_modules/missions/screens/StreakMain';
import { RewardMain } from '_modules/rewards/screens/RewardMain';

import { TabBar } from './components/TabBar';
import { TabRoute } from './components/TabBar/TabBar';

const { Navigator, Screen } = createBottomTabNavigator();
const TabNavigator = () => {
  const tabBar = useCallback(props => <TabBar activeRoute={props.state.routes[props.state.index]?.name as TabRoute} />, []);

  return (
    <Navigator initialRouteName={ROUTES.MAIN_TAB.EARN} tabBar={tabBar}>
      <Screen name={ROUTES.MAIN_TAB.EARN} component={EarnMain} />
      <Screen name={ROUTES.MAIN_TAB.REWARDS} component={RewardMain} />
      <Screen name={ROUTES.MAIN_TAB.WALLET} component={WalletMain} />
      <Screen name={ROUTES.MAIN_TAB.STREAK} component={StreakMain} />
    </Navigator>
  );
};

const MainStack = createStackNavigator();
const MainTab = () => {
  const header = useCallback(({ navigation }: StackHeaderProps) => {
    return <Header navigation={navigation} />;
  }, []);
  return (
    <>
      <EnvBanner />
      <ConnectionBanner />
      <MainStack.Navigator screenOptions={{ header }}>
        <MainStack.Screen name={ROUTES.MAIN_TAB.MAIN} component={TabNavigator} />
      </MainStack.Navigator>
    </>
  );
};

export default memo(MainTab);

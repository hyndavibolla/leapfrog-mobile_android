import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { NavigationButton } from '_components/NavigationButton';
import { NavigationButtonType } from '_components/NavigationButton/NavigationButton';
import { ROUTES } from '_constants';

import { styles } from './styles';

export type TabRoute = keyof typeof ROUTES.MAIN_TAB;

export interface Props {
  activeRoute: TabRoute;
}

export const TabBar = ({ activeRoute }: Props) => {
  const { navigate } = useNavigation();

  const tabList = useMemo(
    () =>
      [
        [NavigationButtonType.EARN, ROUTES.MAIN_TAB.EARN],
        [NavigationButtonType.STREAK, ROUTES.MAIN_TAB.STREAK],
        [NavigationButtonType.REWARD, ROUTES.MAIN_TAB.REWARDS],
        [NavigationButtonType.WALLET, ROUTES.MAIN_TAB.WALLET]
      ].filter(Boolean) as [NavigationButtonType, TabRoute][],
    []
  );

  return (
    <View style={styles.container}>
      {tabList.map(([type, route]) => (
        <NavigationButton key={type} type={type} active={route === activeRoute} onPress={() => navigate(route)} />
      ))}
    </View>
  );
};

export default memo(TabBar);

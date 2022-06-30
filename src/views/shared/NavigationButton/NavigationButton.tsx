import React, { memo, useMemo } from 'react';
import { TouchableHighlight, GestureResponderEvent, TouchableHighlightProps, View } from 'react-native';
import { Text } from '../Text';
import { View as AnimatedView } from 'react-native-animatable';

import { useTestingHelper } from '_utils/useTestingHelper';
import { Icon } from '_commons/components/atoms/Icon';
import { ICON } from '_constants/icons';
import { COLOR, FONT_SIZE } from '_constants/styles';

import { styles } from './styles';

export enum NavigationButtonType {
  STREAK = 'streak',
  EARN = 'earn',
  REWARD = 'reward',
  WALLET = 'wallet'
}

export interface Props extends TouchableHighlightProps {
  type: NavigationButtonType;
  active: boolean;
  onPress: (event: GestureResponderEvent) => void;
}
export const NavigationButton = ({ type, active, onPress, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('navigation-button');
  const contentMap = useMemo(
    () => ({
      [NavigationButtonType.STREAK]: {
        title: 'Missions',
        icon: <Icon name={ICON.MISSION} size={FONT_SIZE.HUGE} />,
        inactiveIcon: <Icon name={ICON.MISSION} size={FONT_SIZE.HUGE} color={COLOR.DARK_GRAY} />
      },
      [NavigationButtonType.EARN]: {
        title: 'Earn',
        icon: <Icon name={ICON.ROCKET} size={FONT_SIZE.HUGE} />,
        inactiveIcon: <Icon name={ICON.ROCKET} size={FONT_SIZE.HUGE} color={COLOR.DARK_GRAY} />
      },
      [NavigationButtonType.REWARD]: {
        title: 'Rewards',
        icon: <Icon name={ICON.REWARDS_GIFT_CARDS} size={FONT_SIZE.HUGE} />,
        inactiveIcon: <Icon name={ICON.REWARDS_GIFT_CARDS} size={FONT_SIZE.HUGE} color={COLOR.DARK_GRAY} />
      },
      [NavigationButtonType.WALLET]: {
        title: 'Wallet',
        icon: <Icon name={ICON.CARD} size={FONT_SIZE.HUGE} />,
        inactiveIcon: <Icon name={ICON.CARD} size={FONT_SIZE.HUGE} color={COLOR.DARK_GRAY} />
      }
    }),
    []
  );

  const contentDataSet = contentMap[type];

  if (!contentDataSet) return null;

  return (
    <TouchableHighlight {...props} {...getTestIdProps(`${type}`)} onPress={onPress} style={styles.container} underlayColor={null}>
      <AnimatedView transition="opacity" style={[styles.buttonContainer, active && styles.active]} duration={200}>
        <View>{active ? contentMap[type].icon : contentMap[type].inactiveIcon}</View>
        <Text style={[styles.title, active && styles.textActive]}>{contentMap[type].title}</Text>
      </AnimatedView>
    </TouchableHighlight>
  );
};

export default memo(NavigationButton);

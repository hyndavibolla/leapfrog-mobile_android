import React, { memo } from 'react';
import { View, TouchableHighlight, ViewStyle, TextStyle } from 'react-native';
import { View as AnimatedView } from 'react-native-animatable';

import { Text } from '../Text';
import { styles } from './styles';
import { FONT_FAMILY } from '../../../constants';
import { useTestingHelper } from '../../../utils/useTestingHelper';

export interface IOption {
  key: string;
  label: string;
}

export interface Props {
  optionList: IOption[];
  activeKey: string;
  onPress: (key: string) => void;
  containerStyle?: ViewStyle;
  activePillStyle?: ViewStyle;
  activeTextStyle?: TextStyle;
  inactiveTextStyle?: TextStyle;
  isInvalid?: boolean;
}

export const SwitchNavBar = ({ optionList, activeKey, onPress, containerStyle, activePillStyle, activeTextStyle, inactiveTextStyle, isInvalid }: Props) => {
  const { getTestIdProps } = useTestingHelper('switch-nav-bar');
  const optionWidth = 100 / optionList.length;
  const activeLeft = Math.max(optionList.findIndex(o => o.key === activeKey) * optionWidth, 0);
  const activePaddingPercentage = 2;

  return (
    <View style={[styles.container, isInvalid && styles.invalidContainer]}>
      <View style={styles.containerSwitch}>
        <View style={[styles.containerOptions, containerStyle, { padding: `${activePaddingPercentage / 2}%` }]}>
          <AnimatedView
            transition="left"
            duration={100}
            style={[
              styles.toggle,
              styles.toggleActive,
              activePillStyle,
              { width: `${optionWidth - activePaddingPercentage}%`, left: `${activeLeft + activePaddingPercentage}%` },
              [null, undefined].includes(activeKey) && styles.hiddenPill
            ]}
          />
          {optionList.map(({ key, label }) => (
            <TouchableHighlight
              {...getTestIdProps(`btn-${key}`)}
              key={key}
              underlayColor="transparent"
              style={styles.toggleContainer}
              onPress={() => onPress(key)}
            >
              <Text
                font={FONT_FAMILY.HEAVY}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.text, key === activeKey ? activeTextStyle : inactiveTextStyle]}
              >
                {label}
              </Text>
            </TouchableHighlight>
          ))}
        </View>
      </View>
    </View>
  );
};

export default memo(SwitchNavBar);

export const SwitchNavBarAlt = memo((props: Props) => (
  <SwitchNavBar
    containerStyle={styles.altContainer}
    activePillStyle={styles.altActivePill}
    activeTextStyle={styles.altActiveText}
    inactiveTextStyle={styles.altInactiveText}
    {...props}
  />
));

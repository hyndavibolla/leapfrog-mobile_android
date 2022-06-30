import React, { memo, useContext } from 'react';
import { View, StyleProp, TextStyle } from 'react-native';
import { View as AnimatedView } from 'react-native-animatable';

import { Text } from '../Text';
import { styles, NUMBER_SIZE } from './styles';
import { formatNumber } from '../../../utils/formatNumber';
import { GlobalContext } from '../../../state-mgmt/GlobalState';

export interface Props {
  children: number;
  hideNumber?: boolean;
  valueStyle?: StyleProp<TextStyle>;
}

export const RouletteNumber = ({ children, hideNumber, valueStyle }: Props) => {
  const { deps } = useContext(GlobalContext);
  const maxDuration = 2000;
  const minDuration = 500;
  const getNumberList = (n: number) =>
    String(isNaN(n) ? 0 : n)
      .split('')
      .map(Number);
  const fullRangeList = Array(10)
    .fill(null)
    .map((_, i) => i);
  const columnList = getNumberList(children);
  const separatorList = formatNumber(children)
    .split('')
    .reduce((list, char) => {
      const hasSeparator = list.some(Boolean);
      const isSeparator = isNaN(char as any);
      const item = isSeparator ? char : null;

      if (!hasSeparator || !isSeparator) return [...list, item];
      return [...list.slice(0, list.length - 1), item];
    }, [] as string[]);

  return (
    <View style={[styles.container, { paddingBottom: deps.nativeHelperService.platform.select({ ios: 0, default: 5 }) }]}>
      {columnList
        .filter((value, index, list) => !(!value && !index && list.length !== 1)) // avoid rendering numbers like "-0300"
        .map((value, index) => (
          <View
            key={index /** no other key to use here */}
            style={[styles.numberContainer, { marginRight: deps.nativeHelperService.platform.select({ ios: -1, default: 0 }) }]}
          >
            <AnimatedView
              transition="top"
              style={[styles.numberInnerContainer, { top: NUMBER_SIZE * (10 - (10 - (value || 0))) * -1 }]}
              duration={Math.min(maxDuration, Math.max(minDuration, Math.round(Math.random() * 10000) / 2))}
            >
              {fullRangeList.map((num, numIndex /** no other key to use here */) => (
                <Text key={numIndex} style={[styles.value, valueStyle]}>
                  {separatorList[index] ?? null}
                  {hideNumber ? '-' : num}
                </Text>
              ))}
            </AnimatedView>
          </View>
        ))}
    </View>
  );
};

export default memo(RouletteNumber);

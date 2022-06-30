import React, { memo, ReactNode } from 'react';
import { Animated, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

export interface Props {
  style?: StyleProp<ViewStyle>;
  translateY: Animated.AnimatedInterpolation;
  children: ReactNode;
  handleLayout?: ({
    nativeEvent: {
      layout: { height }
    }
  }: LayoutChangeEvent) => void;
}

const TranslateSearchBarWrapper = ({ style, translateY, children, handleLayout }: Props) => {
  const { getTestIdProps } = useTestingHelper('translate-searchbar-wrapper');

  return (
    <Animated.View
      style={[
        styles.container,

        translateY && {
          transform: [
            {
              translateY
            }
          ]
        },
        style
      ]}
      onLayout={handleLayout}
      {...getTestIdProps('container')}
    >
      {children}
    </Animated.View>
  );
};

export default memo(TranslateSearchBarWrapper);

import { useState } from 'react';
import { Animated } from 'react-native';

export const useAnimatedHeader = () => {
  const [scrollYValue] = useState(new Animated.Value(0));
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollYValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp'
      }),
      new Animated.Value(0)
    ),
    0,
    50
  );
  const searchBarTranslate = clampedScroll.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -55],
    extrapolate: 'clamp'
  });
  return { scrollYValue, searchBarTranslate };
};

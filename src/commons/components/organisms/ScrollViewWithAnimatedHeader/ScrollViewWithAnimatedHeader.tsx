import React, { memo, ReactElement, ReactNode, useRef } from 'react';
import { Animated, StatusBar, useWindowDimensions, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '_commons/components/molecules/Backbutton/BackButton';
import { styles } from './styles';

const HEADER_MAX_HEIGHT = 184;
const HEADER_MIN_HEIGHT = 106;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface Props {
  header?: ReactElement;
  floatingComponent?: ReactNode;
  floatingComponentLeftPosition?: number;
  containerStyle?: ViewStyle;
  children?: ReactNode;
}

const ScrollViewWithAnimatedHeader = ({ containerStyle, header, children, floatingComponent, floatingComponentLeftPosition = 108 }: Props) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp'
  });

  const headerElementOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0.2],
    extrapolate: 'clamp'
  });

  const componentLeftPosition = scrollY.interpolate({
    inputRange: [120, 180],
    outputRange: [floatingComponentLeftPosition, 80],
    extrapolate: 'clamp'
  });

  const componentTopPosition = scrollY.interpolate({
    inputRange: [HEADER_MIN_HEIGHT - 10, HEADER_MAX_HEIGHT],
    outputRange: [190, 132],
    extrapolate: 'clamp'
  });

  return (
    <>
      <StatusBar translucent barStyle="light-content" />
      <SafeAreaView style={[styles.container, containerStyle]} edges={['right', 'top', 'left']}>
        <BackButton containerStyle={styles.backBtn} />
        <Animated.View style={[styles.header, { height: HEADER_MAX_HEIGHT, transform: [{ translateY: headerTranslateY }] }]}>
          <Animated.View
            style={{
              opacity: headerElementOpacity
            }}
          >
            {header}
          </Animated.View>
          <Animated.View
            style={[
              styles.floatingComponent,
              {
                transform: [{ translateY: componentTopPosition }, { translateX: componentLeftPosition }]
              },
              {
                width: width - 100
              }
            ]}
          >
            {floatingComponent}
          </Animated.View>
        </Animated.View>
        <Animated.ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
          scrollEventThrottle={16}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        >
          {children}
        </Animated.ScrollView>
      </SafeAreaView>
    </>
  );
};

export default memo(ScrollViewWithAnimatedHeader);

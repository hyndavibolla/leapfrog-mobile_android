import React, { memo, ReactElement, useState } from 'react';
import { View, Text, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { Icon } from '_commons/components/atoms/Icon';
import { useTestingHelper } from '_utils/useTestingHelper';
import { ICON, COLOR, FONT_SIZE } from '_constants';

import { styles } from './styles';

export interface Props {
  iconLeft: ICON;
  textLeft: string;
  children: ReactElement;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: COLOR;
  onTapRight?: () => void;
  parentMargin?: number;
}
let swipeableHeight: number; /* It is necessary to obtain a relative value of height  */

const SwipeItem = ({ children, textLeft, iconLeft, style, backgroundColor = COLOR.DARK_GRAY, onTapRight, parentMargin = 16 }: Props) => {
  const { getTestIdProps } = useTestingHelper('swipe-item');
  const [isOpen, setIsOpen] = useState(false);

  const onLayout = event => {
    const { height } = event.nativeEvent.layout;
    swipeableHeight = height - parentMargin;
  };

  const componentRight = () => (
    <TouchableOpacity activeOpacity={1} onPress={onTapRight} {...getTestIdProps('right-button')}>
      <View style={[styles.containerOption, { height: swipeableHeight }]} {...getTestIdProps('right-button-container')}>
        <Icon size={FONT_SIZE.BIG} name={iconLeft} color={COLOR.WHITE} />
        <Text style={styles.optionText}>{textLeft}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container} {...getTestIdProps('element')} onLayout={onLayout}>
      <Swipeable
        containerStyle={styles.swipe}
        childrenContainerStyle={style}
        onBegan={/* istanbul ignore next line */ () => setIsOpen(true)}
        onSwipeableWillClose={/* istanbul ignore next line */ () => setIsOpen(false)}
        useNativeAnimations
        renderRightActions={componentRight}
      >
        {children}
      </Swipeable>
      {/* istanbul ignore next line */ isOpen && <View style={[styles.shadowContainer, { backgroundColor, height: swipeableHeight }]} />}
    </View>
  );
};

export default memo(SwipeItem);

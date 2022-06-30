import React, { memo, ReactElement, useCallback, useRef } from 'react';
import { View, Animated, FlatListProps } from 'react-native';

import { styles } from './styles';

export type Props = {
  children: ReactElement<FlatListProps<any>>;
  separatorWidth: number;
  itemWidth: number;
};

const Carrousel = ({ children, itemWidth, separatorWidth }: Props) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const { renderItem, contentContainerStyle, style } = children.props;

  const itemSeparatorComponent = useCallback(() => <View style={{ width: separatorWidth, minHeight: 1 }} />, [separatorWidth]);

  return (
    <Animated.FlatList
      {...children.props}
      horizontal
      snapToInterval={itemWidth + separatorWidth}
      decelerationRate={0}
      style={[styles.body, style]}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      ItemSeparatorComponent={itemSeparatorComponent}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
      renderItem={item => <View style={[styles.view, { width: itemWidth }]}>{renderItem(item)}</View>}
    />
  );
};

export default memo(Carrousel);

import React, { useCallback } from 'react';
import { FlatList } from 'react-native';

import { CircleSkeleton, SkeletonBlock } from '_components/SkeletonItem';

import { COLOR } from '_constants';

import { styles } from './styles';

function BubbleSkeleton() {
  const renderBubble = useCallback(() => {
    return <CircleSkeleton size={60} style={styles.bubble} />;
  }, []);

  return (
    <SkeletonBlock style={styles.container} color={COLOR.MEDIUM_GRAY} radius={20}>
      <FlatList style={styles.list} data={Array(6)} renderItem={renderBubble} horizontal showsHorizontalScrollIndicator={false} />
    </SkeletonBlock>
  );
}

export default BubbleSkeleton;

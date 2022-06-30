import React, { memo, useCallback } from 'react';
import { ScrollView, FlatList } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { SkeletonVerticalDivision, SkeletonItem, RowSkeletonItem, SkeletonBlock } from '_views/shared/SkeletonItem';
import { COLOR } from '_constants';
import { styles } from './styles';

export const MissionListSkeleton = memo(() => {
  const { getTestIdProps } = useTestingHelper('mission-list-skeleton');

  const renderItems = useCallback(() => {
    return (
      <>
        <RowSkeletonItem />
        <SkeletonVerticalDivision />
      </>
    );
  }, []);

  return (
    <ScrollView {...getTestIdProps('container')} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <SkeletonItem>
        <SkeletonBlock width="95%" height="20px" radius={30} color={COLOR.SKELETON_GRAY} style={styles.horizontalItem} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="67px" radius={8} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="95%" height="20px" radius={30} color={COLOR.SKELETON_GRAY} style={styles.horizontalItem} />
        <SkeletonVerticalDivision />
        <FlatList data={Array(9)} renderItem={renderItems} showsVerticalScrollIndicator={false} />
      </SkeletonItem>
    </ScrollView>
  );
});

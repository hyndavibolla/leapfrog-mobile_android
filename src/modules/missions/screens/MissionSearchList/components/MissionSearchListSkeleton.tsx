import React, { memo } from 'react';
import { ScrollView } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { SearchSkeletonItem, SkeletonVerticalDivision, RowSkeletonItem, SkeletonItem } from '_components/SkeletonItem';
import { styles } from './styles';

export const StreakListSkeleton = memo(() => {
  const { getTestIdProps } = useTestingHelper('streak-list-skeleton');
  return (
    <ScrollView {...getTestIdProps('container')} contentContainerStyle={styles.container}>
      <SkeletonItem>
        <SearchSkeletonItem />
        <SkeletonVerticalDivision />
        <RowSkeletonItem />
        <SkeletonVerticalDivision />
        <RowSkeletonItem />
        <SkeletonVerticalDivision />
        <RowSkeletonItem />
        <SkeletonVerticalDivision />
        <RowSkeletonItem />
        <SkeletonVerticalDivision />
        <RowSkeletonItem />
        <SkeletonVerticalDivision />
        <RowSkeletonItem />
        <SkeletonVerticalDivision />
        <RowSkeletonItem />
        <SkeletonVerticalDivision />
        <RowSkeletonItem />
        <SkeletonVerticalDivision />
        <RowSkeletonItem />
        <SkeletonVerticalDivision />
        <RowSkeletonItem />
        <SkeletonVerticalDivision />
        <RowSkeletonItem />
        <SkeletonVerticalDivision />
      </SkeletonItem>
    </ScrollView>
  );
});

import React, { memo } from 'react';
import { ScrollView } from 'react-native';

import {
  SkeletonVerticalDivision,
  SkeletonHorizontalDivision,
  MediumSquareSkeletonItemAlt,
  SkeletonItem,
  SkeletonList,
  SkeletonBlock,
  CircleSkeleton,
  TileSkeletonItem
} from '_components/SkeletonItem';
import { COLOR } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles.skeleton';

export default memo(() => {
  const { getTestIdProps } = useTestingHelper('streak-main-skeleton');
  return (
    <ScrollView {...getTestIdProps('container')} contentContainerStyle={styles.container}>
      <SkeletonItem>
        <SkeletonBlock dir="row" color={COLOR.TRANSPARENT} style={styles.sectionTop}>
          <SkeletonBlock width="40%" height="20px" />
          <CircleSkeleton size={25} />
        </SkeletonBlock>

        <SkeletonBlock width="100%" height="13px" radius={6} style={{ marginTop: 26 }} />
        <SkeletonBlock width="100%" height="13px" radius={6} style={{ marginTop: 15 }} />

        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <SkeletonList repetitionCount={2}>
          <>
            <MediumSquareSkeletonItemAlt />
            <SkeletonHorizontalDivision />
          </>
        </SkeletonList>

        <SkeletonBlock width="95%" height="20px" radius={10} style={{ marginTop: 29, marginBottom: 35 }} />

        <SkeletonBlock dir="column" color={COLOR.TRANSPARENT} style={styles.cardDivisor}>
          <TileSkeletonItem height={195} width={158} />
          <TileSkeletonItem height={195} width={158} />
          <SkeletonVerticalDivision />
          <TileSkeletonItem height={195} width={158} />
          <TileSkeletonItem height={195} width={158} />
        </SkeletonBlock>

        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
      </SkeletonItem>
    </ScrollView>
  );
});

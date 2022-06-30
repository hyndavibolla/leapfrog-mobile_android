/* istanbul ignore file */
import React, { memo } from 'react';
import { ScrollView } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import {
  FatTextSkeletonItem,
  ShortTextSkeletonItem,
  SkeletonItem,
  SkeletonVerticalDivision,
  TextSkeletonItem,
  TitleBallSkeletonItem,
  SmallTileSkeletonItem,
  SkeletonList,
  SkeletonHorizontalDivision,
  MediumTileSkeletonItem
} from '_views/shared/SkeletonItem';
import { styles } from './styles';

const RewardDetailSkeleton = () => {
  const { getTestIdProps } = useTestingHelper('reward-detail-skeleton');
  return (
    <ScrollView {...getTestIdProps('container')} contentContainerStyle={styles.container}>
      <SkeletonItem>
        <TitleBallSkeletonItem />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <MediumTileSkeletonItem />
        <SkeletonVerticalDivision />
        <TextSkeletonItem />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <SkeletonList horizontal={true} repetitionCount={7}>
          <SmallTileSkeletonItem />
          <SkeletonHorizontalDivision />
        </SkeletonList>
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <FatTextSkeletonItem />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <ShortTextSkeletonItem />
        <SkeletonVerticalDivision />
        <TextSkeletonItem />
        <SkeletonVerticalDivision />
        <ShortTextSkeletonItem />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <ShortTextSkeletonItem />
        <SkeletonVerticalDivision />
        <TextSkeletonItem />
        <SkeletonVerticalDivision />
        <ShortTextSkeletonItem />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <ShortTextSkeletonItem />
        <SkeletonVerticalDivision />
        <TextSkeletonItem />
        <SkeletonVerticalDivision />
        <ShortTextSkeletonItem />
      </SkeletonItem>
    </ScrollView>
  );
};

export default memo(RewardDetailSkeleton);

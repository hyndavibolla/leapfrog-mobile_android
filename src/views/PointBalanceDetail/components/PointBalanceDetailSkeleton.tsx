import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { COLOR } from '_constants';

import { useTestingHelper } from '_utils/useTestingHelper';
import {
  SkeletonVerticalDivision,
  SkeletonItem,
  SkeletonBlock,
  ListHeaderComponentSkeletonItem,
  SkeletonItemReward,
  SkeletonItemOffer
} from '_views/shared/SkeletonItem';
import { styles } from './styles';

export const PointBalanceDetailSkeleton = memo(() => {
  const { getTestIdProps } = useTestingHelper('point-balance-detail-skeleton');

  return (
    <ScrollView {...getTestIdProps('container')} contentContainerStyle={styles.container}>
      <SkeletonItem>
        <ListHeaderComponentSkeletonItem />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="167px" height="20px" radius={20} color={COLOR.SKELETON_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonItemReward />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="58px" dir="column" style={{ justifyContent: 'space-between' }} color={COLOR.TRANSPARENT}>
          <SkeletonBlock dir="row" style={{ justifyContent: 'space-between' }} color={COLOR.TRANSPARENT}>
            <SkeletonBlock width="167px" height="21px" radius={20} color={COLOR.SKELETON_GRAY} />
            <SkeletonBlock width="94px" height="21px" radius={20} color={COLOR.SKELETON_GRAY} />
          </SkeletonBlock>
          <SkeletonBlock width="94px" height="21px" radius={20} color={COLOR.SKELETON_GRAY} />
        </SkeletonBlock>
        <SkeletonVerticalDivision />
        <SkeletonItemOffer />
        <SkeletonVerticalDivision />
        <SkeletonItemOffer />
        <SkeletonVerticalDivision />
        <SkeletonItemOffer />
        <SkeletonVerticalDivision />
        <SkeletonItemOffer />
        <SkeletonVerticalDivision />
        <SkeletonItemOffer />
      </SkeletonItem>
    </ScrollView>
  );
});

import React from 'react';
import { ScrollView, View } from 'react-native';
import { COLOR } from '_constants/styles';

import { useTestingHelper } from '_utils/useTestingHelper';
import {
  SkeletonVerticalDivision,
  TextSkeletonItem,
  SkeletonHorizontalDivision,
  SkeletonItem,
  SkeletonList,
  ShortTextSkeletonItem,
  CircleSkeleton,
  SkeletonBlock
} from '_views/shared/SkeletonItem';
import { styles } from './styles';

function RewardMainSkeleton() {
  const { getTestIdProps } = useTestingHelper('reward-main-skeleton');

  return (
    <ScrollView {...getTestIdProps('container')} contentContainerStyle={styles.container}>
      <SkeletonItem>
        <TextSkeletonItem />
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />

        <SkeletonBlock width="100%" height="200px" radius={8} />

        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />

        <ShortTextSkeletonItem width={40} />
        <SkeletonVerticalDivision />
        <SkeletonList repetitionCount={6}>
          <>
            <SkeletonBlock width="150px" height="100px" radius={8} />
            <SkeletonHorizontalDivision />
          </>
        </SkeletonList>

        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />

        <ShortTextSkeletonItem width={40} />
        <SkeletonVerticalDivision />
        <SkeletonList repetitionCount={6}>
          <>
            <SkeletonBlock width="150px" height="100px" radius={8} />
            <SkeletonHorizontalDivision />
          </>
        </SkeletonList>

        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />

        <ShortTextSkeletonItem width={40} />
        <SkeletonVerticalDivision />
        <SkeletonList repetitionCount={6}>
          <>
            <SkeletonBlock width="150px" height="100px" radius={8} />
            <SkeletonHorizontalDivision />
          </>
        </SkeletonList>

        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />

        <ShortTextSkeletonItem width={40} />
        <SkeletonVerticalDivision />
        <SkeletonList repetitionCount={6}>
          <>
            <SkeletonBlock width="150px" height="100px" radius={8} />
            <SkeletonHorizontalDivision />
          </>
        </SkeletonList>

        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />

        <ShortTextSkeletonItem width={40} />
        <SkeletonVerticalDivision />
        <SkeletonList repetitionCount={6}>
          <>
            <SkeletonBlock width="150px" height="100px" radius={8} />
            <SkeletonHorizontalDivision />
          </>
        </SkeletonList>

        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />

        <ShortTextSkeletonItem width={40} />
        <SkeletonVerticalDivision />
        <SkeletonList repetitionCount={6}>
          <>
            <SkeletonBlock width="150px" height="100px" radius={8} />
            <SkeletonHorizontalDivision />
          </>
        </SkeletonList>

        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />

        <ShortTextSkeletonItem width={40} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" radius={8} color={COLOR.MEDIUM_GRAY}>
          <View style={{ paddingVertical: 14 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <SkeletonHorizontalDivision />
              <CircleSkeleton size={60} />
              <SkeletonHorizontalDivision />
              <CircleSkeleton size={60} />
              <SkeletonHorizontalDivision />
              <CircleSkeleton size={60} />
              <SkeletonHorizontalDivision />
              <CircleSkeleton size={60} />
              <SkeletonHorizontalDivision />
              <CircleSkeleton size={60} />
              <SkeletonHorizontalDivision />
              <CircleSkeleton size={60} />
            </ScrollView>
          </View>
        </SkeletonBlock>

        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />

        <SkeletonBlock width="100%" height="160px" radius={8} />

        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
        <View style={styles.footerContainer}>
          <SkeletonBlock width="150px" height="66px" radius={8} />
        </View>
      </SkeletonItem>
    </ScrollView>
  );
}

export default RewardMainSkeleton;

import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { COLOR } from '_constants/styles';

import { useTestingHelper } from '_utils/useTestingHelper';
import {
  SkeletonItem,
  SkeletonBlock,
  ShortTextSkeletonItem,
  CardOfferSkeleton,
  CardElementSkeleton,
  TileSkeletonItem,
  CardOfferWithOutIconSkeleton,
  CardOfferWithButtonSkeleton,
  CardOfferIconRightSkeleton,
  SkeletonVerticalDivision,
  SkeletonHorizontalDivision,
  CircleSkeleton
} from '_components/SkeletonItem';

import { styles } from './styles';

const EarnMainSkeleton = () => {
  const { getTestIdProps } = useTestingHelper('earn-main-skeleton');

  const cardMapSkeleton = useMemo(
    () => (
      <SkeletonBlock width="100%" height="94px" radius={8} color={COLOR.MEDIUM_GRAY} style={styles.cardMap}>
        <CircleSkeleton size={60} />
        <SkeletonBlock width="50%" height="40px" radius={30} />
      </SkeletonBlock>
    ),
    []
  );

  const skeletonBlock = useCallback(() => <SkeletonBlock height="16px" width="1px" />, []);

  return (
    <ScrollView {...getTestIdProps('container')} style={styles.backGroundColor} contentContainerStyle={styles.body}>
      <SkeletonItem>
        <View style={styles.title}>
          <ShortTextSkeletonItem width={40} />
        </View>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <SkeletonHorizontalDivision />
          <CardOfferSkeleton height={148} width={330} />
          <SkeletonHorizontalDivision />
          <CardOfferSkeleton height={148} width={330} />
        </ScrollView>

        <View style={styles.title}>
          <ShortTextSkeletonItem width={40} />
        </View>

        <View style={styles.container}>
          <CardOfferWithOutIconSkeleton />
        </View>

        <View style={styles.title}>
          <ShortTextSkeletonItem width={40} />
        </View>

        <FlatList
          numColumns={3}
          ItemSeparatorComponent={skeletonBlock}
          data={Array(9).fill('')}
          renderItem={() => (
            <SkeletonBlock color={COLOR.MEDIUM_GRAY} width={'28%'} height={'125px'} style={styles.mission}>
              <CircleSkeleton />
            </SkeletonBlock>
          )}
        />

        <View style={styles.title}>
          <ShortTextSkeletonItem width={40} />
          <SkeletonBlock width="80%" height="14px" radius={10} style={{ marginTop: 12 }} />
          <SkeletonBlock width="60%" height="14px" radius={10} style={{ marginTop: 6 }} />
          <SkeletonBlock width="100%" height="131px" color={COLOR.MEDIUM_GRAY} radius={8} style={styles.mapSearch}>
            <SkeletonBlock width="58%" height="40px" radius={30} />
          </SkeletonBlock>
          {cardMapSkeleton}
          {cardMapSkeleton}
          {cardMapSkeleton}
          {cardMapSkeleton}
        </View>

        <View style={styles.title}>
          <ShortTextSkeletonItem width={40} />
          <View style={styles.cardDivisor}>
            <CardElementSkeleton style={styles.cardDivisorDetail} />
            <CardElementSkeleton style={styles.cardDivisorDetail} />
            <CardElementSkeleton style={styles.cardDivisorDetail} />
            <CardElementSkeleton style={styles.cardDivisorDetail} />
            <CardElementSkeleton style={styles.cardDivisorDetail} />
            <CardElementSkeleton style={styles.cardDivisorDetail} />
          </View>
        </View>

        <View style={styles.title}>
          <ShortTextSkeletonItem width={40} />
        </View>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <SkeletonHorizontalDivision />
          <TileSkeletonItem height={196} width={158} />
          <SkeletonHorizontalDivision />
          <TileSkeletonItem height={196} width={158} />
          <SkeletonHorizontalDivision />
          <TileSkeletonItem height={196} width={158} />
        </ScrollView>

        <View style={styles.title}>
          <ShortTextSkeletonItem width={40} />
        </View>

        <View style={styles.container}>
          <CardOfferWithOutIconSkeleton />
        </View>

        <View style={styles.title}>
          <ShortTextSkeletonItem width={40} />
        </View>

        <View style={styles.container}>
          <CardOfferWithButtonSkeleton />
        </View>

        <View style={styles.title}>
          <ShortTextSkeletonItem width={40} />
        </View>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <SkeletonHorizontalDivision />
          <CardOfferIconRightSkeleton hideCircle />
          <SkeletonHorizontalDivision />
          <CardOfferIconRightSkeleton hideCircle />
        </ScrollView>
        <SkeletonVerticalDivision />
        <SkeletonVerticalDivision />
      </SkeletonItem>
    </ScrollView>
  );
};

export default memo(EarnMainSkeleton);

import React, { memo, useCallback } from 'react';
import { ScrollView } from 'react-native';

import { SkeletonItem, SkeletonBlock, SkeletonVerticalDivision } from '../../shared/SkeletonItem';

import { useTestingHelper } from '../../../utils/useTestingHelper';

import { COLOR } from '_constants';

import GiftCardWaterMark from '../../../assets/shared/sywGiftCardWaterMark.svg';

import { styles } from './styles';

export const GiftCardListDetailSkeleton = memo(() => {
  const { getTestIdProps } = useTestingHelper('gift-list-detail-skeleton');

  const getPhraseSkeleton = useCallback(
    () => (
      <SkeletonBlock width="100%" color={COLOR.TRANSPARENT}>
        <SkeletonBlock width="83px" height="20px" radius={10} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="254px" height="13px" radius={6.5} color={COLOR.MEDIUM_GRAY} />
      </SkeletonBlock>
    ),
    []
  );

  const getArticleSkeleton = useCallback(
    (widthLargeText = '254px') => (
      <SkeletonBlock width="100%" style={{ paddingHorizontal: 27 }} color={COLOR.TRANSPARENT}>
        <SkeletonBlock width="117px" height="20px" radius={10} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width={widthLargeText} height="13px" radius={6.5} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="156px" height="13px" radius={6.5} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width={widthLargeText} height="13px" radius={6.5} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="156px" height="13px" radius={6.5} color={COLOR.MEDIUM_GRAY} />
      </SkeletonBlock>
    ),
    []
  );

  return (
    <ScrollView {...getTestIdProps('container')} style={styles.backGroundColor} contentContainerStyle={styles.body}>
      <SkeletonItem>
        <SkeletonBlock width="100%" height="519px" dir="column" style={{ justifyContent: 'space-between', paddingHorizontal: 15 }} color={COLOR.TRANSPARENT}>
          <SkeletonBlock
            width="100%"
            height="62px"
            dir="row"
            style={{ alignItems: 'center', paddingHorizontal: 20, borderTopStartRadius: 8, borderTopEndRadius: 8 }}
            radius={0}
          >
            <SkeletonBlock width="40px" height="40px" radius={20} color={COLOR.MEDIUM_GRAY} />
            <SkeletonBlock width="20px" color={COLOR.TRANSPARENT} />
            <SkeletonBlock width="117px" height="20px" radius={10} color={COLOR.MEDIUM_GRAY} />
          </SkeletonBlock>
          <SkeletonBlock
            width="100%"
            height="457px"
            dir="column"
            color={COLOR.WHITE}
            style={{ alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 23, borderBottomStartRadius: 8, borderBottomEndRadius: 8 }}
            radius={0}
          >
            <SkeletonBlock width="298px" height="13px" radius={6.5} color={COLOR.MEDIUM_GRAY} />
            <SkeletonBlock width="127px" height="121px" radius={8} color={COLOR.MEDIUM_GRAY} />
            {getPhraseSkeleton()}
            {getPhraseSkeleton()}
            {getPhraseSkeleton()}
          </SkeletonBlock>
        </SkeletonBlock>
        <SkeletonBlock style={{ alignItems: 'center' }} color={COLOR.TRANSPARENT}>
          <SkeletonBlock width="100%" height="36px" color={COLOR.TRANSPARENT} />
          {getArticleSkeleton()}
          <SkeletonBlock width="100%" height="40px" color={COLOR.TRANSPARENT} />
          {getArticleSkeleton('100%')}
          <SkeletonBlock width="100%" height="36px" color={COLOR.TRANSPARENT} />
          {getArticleSkeleton('100%')}
        </SkeletonBlock>
      </SkeletonItem>
      <SkeletonBlock style={{ alignItems: 'center' }} color={COLOR.TRANSPARENT}>
        <SkeletonBlock width="100%" height="64px" color={COLOR.TRANSPARENT} />
        <GiftCardWaterMark />
      </SkeletonBlock>
    </ScrollView>
  );
});

/* istanbul ignore file */
import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { COLOR } from '_constants';

import { useTestingHelper } from '../../../utils/useTestingHelper';
import { SkeletonVerticalDivision, SkeletonItem, SkeletonBlock } from '../../shared/SkeletonItem';
import { styles } from './styles';

export const FaqSkeleton = memo(() => {
  const { getTestIdProps } = useTestingHelper('faq-skeleton');

  return (
    <ScrollView {...getTestIdProps('container')} contentContainerStyle={styles.container}>
      <SkeletonItem>
        <SkeletonBlock width="100%" height="20px" radius={20} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="20px" radius={20} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="80%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="50%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="20px" radius={20} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="20px" radius={20} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="80%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="50%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="20px" radius={20} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="20px" radius={20} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="80%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="50%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="20px" radius={20} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="20px" radius={20} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="80%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="50%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="20px" radius={20} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="20px" radius={20} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="80%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="50%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
      </SkeletonItem>
    </ScrollView>
  );
});

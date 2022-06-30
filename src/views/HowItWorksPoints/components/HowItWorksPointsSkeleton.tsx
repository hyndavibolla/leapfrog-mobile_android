/* istanbul ignore file */
import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { COLOR } from '_constants';

import { useTestingHelper } from '../../../utils/useTestingHelper';
import { SkeletonVerticalDivision, SkeletonItem, SkeletonBlock } from '../../shared/SkeletonItem';
import { styles } from './styles';

export const HowItWorksPointsSkeleton = memo(() => {
  const { getTestIdProps } = useTestingHelper('how-it-works-point-skeleton');

  return (
    <ScrollView {...getTestIdProps('container')} contentContainerStyle={styles.container}>
      <SkeletonItem>
        <SkeletonBlock width="70px" height="70px" radius={70} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="120px" height="20px" radius={20} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="50%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />

        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="50%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="50%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="50%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="50%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="50%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="50%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />
        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} />
        <SkeletonVerticalDivision />

        <SkeletonBlock width="100%" height="15px" radius={15} color={COLOR.MEDIUM_GRAY} style={{ marginTop: 65 }} />
      </SkeletonItem>
    </ScrollView>
  );
});

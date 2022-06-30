/* istanbul ignore file */
import React, { memo } from 'react';
import { ScrollView } from 'react-native';

import { useTestingHelper } from '../../../utils/useTestingHelper';
import {
  SkeletonItem,
  ImageSkeletonItem,
  MissionDetailDescriptionSkeletonItem,
  MissionDetailDisclaimerSkeletonItem,
  MissionDetailButtonSkeletonItem
} from '../../shared/SkeletonItem';
import { styles } from './styles';

export const MissionDetailSkeleton = memo(() => {
  const { getTestIdProps } = useTestingHelper('mission-detail-skeleton');
  return (
    <ScrollView {...getTestIdProps('container')} contentContainerStyle={styles.container}>
      <SkeletonItem>
        <ImageSkeletonItem />
        <MissionDetailDescriptionSkeletonItem />
        <MissionDetailDisclaimerSkeletonItem />
        <MissionDetailButtonSkeletonItem />
      </SkeletonItem>
    </ScrollView>
  );
});

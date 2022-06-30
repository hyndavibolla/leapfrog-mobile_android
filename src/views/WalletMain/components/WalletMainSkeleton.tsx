import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { SkeletonItem, TextSkeletonItem, SkeletonBlock } from '../../shared/SkeletonItem';
import { styles } from './styles';

export const WalletMainSkeleton = memo(() => {
  const { getTestIdProps } = useTestingHelper('wallet-main-skeleton');
  return (
    <ScrollView {...getTestIdProps('container')} contentContainerStyle={styles.container}>
      <SkeletonItem>
        <TextSkeletonItem style={styles.title} />
        <TextSkeletonItem style={styles.subtitle} />
        <SkeletonBlock style={styles.block} />
        <TextSkeletonItem style={styles.text} />
        <TextSkeletonItem style={styles.title} />
        <TextSkeletonItem style={styles.subtitle} />
        <SkeletonBlock style={styles.block} />
        <SkeletonBlock style={styles.block} />
        <TextSkeletonItem style={styles.button} />
        <TextSkeletonItem style={styles.title} />
        <SkeletonBlock style={styles.block} />
        <SkeletonBlock style={styles.block} />
        <TextSkeletonItem style={styles.button} />
      </SkeletonItem>
    </ScrollView>
  );
});

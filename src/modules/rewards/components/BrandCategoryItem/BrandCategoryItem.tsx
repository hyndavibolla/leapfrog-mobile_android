import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { BrandLogo } from '_components/BrandLogo';
import { MediumCategoryCard } from '_components/MediumCategoryCard';
import { useTestingHelper } from '_utils/useTestingHelper';
import { RewardModel } from '_models';

import { styles } from './styles';

export interface Props {
  rewardBrand: RewardModel.IBrand;
  onPress: (rewardBrand: RewardModel.IBrand) => () => void;
}

export const BrandCategoryItem = ({ rewardBrand, onPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('brand-category-item');

  return rewardBrand.faceplateUrl ? (
    <View style={styles.cardContainer} key={rewardBrand.id}>
      <MediumCategoryCard title="" backgroundUrl={rewardBrand.faceplateUrl} onPress={onPress(rewardBrand)} />
    </View>
  ) : (
    <TouchableOpacity style={[styles.cardContainer, styles.simpleCard]} onPress={onPress(rewardBrand)} {...getTestIdProps('fallback-card')}>
      <BrandLogo image={rewardBrand.iconUrl} />
    </TouchableOpacity>
  );
};

export default memo(BrandCategoryItem);

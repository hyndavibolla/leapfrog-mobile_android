import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { styles } from './styles';
import { Card } from '../Card';
import { BrandLogo } from '../BrandLogo';
import { useTestingHelper } from '../../../utils/useTestingHelper';

export interface Props {
  image: string;
  category?: string;
  onPress?: () => void;
  streakIndicator?: boolean;
}

const PetiteMissionCard = ({ image, category, onPress, streakIndicator }: Props) => {
  const { getTestIdProps } = useTestingHelper('petite-mission-card');
  return (
    <TouchableOpacity {...getTestIdProps('container')} onPress={onPress}>
      <Card style={styles.container}>
        <View style={styles.logoContainer}>
          <BrandLogo image={image} category={category} style={styles.logo} streakIndicator={streakIndicator} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default memo(PetiteMissionCard);

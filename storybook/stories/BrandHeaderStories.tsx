import React from 'react';
import { View } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import { BrandHeader } from '../../src/views/shared/BrandHeader';
import { getMission_1 } from '../../src/test-utils/entities';

import { styles } from '../styles';

const mission1 = getMission_1();

export const OverviewStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Mission Detail Header</Text>
    <Text style={styles.text}>This component is used to render the mission detail header of the game.</Text>
    <View style={styles.division} />
    <Text style={styles.subtitle}>Mission Detail Header</Text>
    <BrandHeader uri={mission1.image} />
    <View style={styles.division} />
  </View>
);

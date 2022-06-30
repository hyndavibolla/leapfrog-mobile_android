import React from 'react';
import { View } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import { BrandLogo } from '../../src/views/shared/BrandLogo';
import { getMission_1 } from '../../src/test-utils/entities';

import { styles } from '../styles';
import { RenderGlobalContextWrapped } from './RenderGlobalContextWrapped';
const mission1 = getMission_1();

export const OverviewStory = () => (
  <RenderGlobalContextWrapped>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Mission Brand Logo</Text>
      <Text style={styles.text}>This component is used to render the mission brand logo or its fallback image.</Text>
      <View style={styles.division} />
      <Text style={styles.subtitle}>Brand Logo</Text>
      <View style={styles.componentContainer}>
        <BrandLogo image={mission1?.brandLogo} category={mission1?.pointsAwarded?.conditions[0]?.category} />
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>Category Fallback</Text>
      <View style={styles.componentContainer}>
        <BrandLogo image={null} category={mission1?.pointsAwarded?.conditions[0]?.category} />
      </View>
    </View>
  </RenderGlobalContextWrapped>
);

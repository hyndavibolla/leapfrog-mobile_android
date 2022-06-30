import React from 'react';
import { View } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import { styles } from '../styles';
import { Divider } from '../../src/views/shared/Divider';

export const OverviewStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Divider</Text>
    <Text style={styles.text}>Basic Divider component that it is used across the app.</Text>
    <View style={styles.division} />
    <Text style={styles.subtitle}>Divider Skeleton</Text>
    <Text style={styles.text}>It's a line divider. </Text>
    <View style={styles.division} />
    <View style={styles.componentContainer}>
      <Text>This is the top section</Text>
      <Divider />
      <Text>This is the bottom section</Text>
    </View>
    <View style={styles.division} />
  </View>
);

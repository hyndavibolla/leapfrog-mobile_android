import React from 'react';
import { View } from 'react-native';
import { Text } from '../../src/views/shared/Text';

import { Pill } from '../../src/views/shared/Pill';
import { styles } from '../styles';

export const PillStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Pill</Text>
    <View style={styles.division} />
    <Text style={styles.title}>With a large number</Text>
    <View style={styles.componentContainer}>
      <Pill>10,000</Pill>
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>With a small number</Text>
    <View style={styles.componentContainer}>
      <Pill>5</Pill>
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>With text</Text>
    <View style={styles.componentContainer}>
      <Pill>with text</Pill>
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>With a number range</Text>
    <View style={styles.componentContainer}>
      <Pill>10,000 - 15,000</Pill>
    </View>
  </View>
);

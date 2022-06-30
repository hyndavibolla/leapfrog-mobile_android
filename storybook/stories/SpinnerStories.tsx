import React from 'react';
import { View } from 'react-native';
import { number } from '@storybook/addon-knobs';

import { Text } from '../../src/views/shared/Text';
import { styles } from '../styles';
import { Spinner } from '../../src/views/shared/Spinner';

export const SpinnerStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Spinner</Text>
    <View style={styles.division} />
    <Text style={styles.title}>Default size</Text>
    <View style={styles.componentContainer}>
      <Spinner />
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>Custom Size</Text>
    <View style={styles.componentContainer}>
      <Spinner size={number('size', 100)} />
    </View>
  </View>
);

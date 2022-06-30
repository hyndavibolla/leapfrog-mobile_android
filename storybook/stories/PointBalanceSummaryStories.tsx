import React from 'react';
import { Alert, View } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import { PointBalanceSummary } from '../../src/views/shared/PointBalanceSummary';
import { styles } from '../styles';

const onPressTop = () => Alert.alert('Alert', 'This is a TOP alert');
const onPressBottom = () => Alert.alert('Alert', 'This is a BOTTOM alert');

export const GeneralStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Point Balance Summary</Text>
    <View style={styles.componentContainer}>
      <View style={styles.division} />
      <PointBalanceSummary onPressTop={onPressTop} onPressBottom={onPressBottom} availablePoints={35422} pendingPoints={2637} />
      <View style={styles.division} />
    </View>
  </View>
);

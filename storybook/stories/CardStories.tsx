import React from 'react';
import { View } from 'react-native';

import { styles } from '../styles';
import { Text } from '../../src/views/shared/Text';
import { Card } from '../../src/views/shared/Card';
import { PointBalanceSummary } from '../../src/views/shared/PointBalanceSummary';
import { COLOR } from '../../src/constants';

export const OverviewStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Card</Text>
    <Text style={styles.text}>Basic card component that it is used across the app.</Text>
    <View style={styles.division} />
    <Text style={styles.subtitle}>Card Skeleton</Text>
    <Text style={styles.text}>Supports different inner content.</Text>
    <View style={styles.division} />
    <View style={styles.componentContainer}>
      <Card style={{ backgroundColor: COLOR.MEDIUM_GRAY, padding: 30 }}>
        <Text style={{ color: COLOR.PRIMARY_BLUE }}>Hi! I'm the card content</Text>
      </Card>
    </View>
    <View style={styles.division} />
    <Text style={styles.subtitle}>Card Example with Point Balance Sumary</Text>
    <View style={styles.componentContainer}>
      <PointBalanceSummary onPressTop={console.log} onPressBottom={console.log} availablePoints={35422} pendingPoints={2637} />
    </View>
    <View style={styles.division} />
  </View>
);

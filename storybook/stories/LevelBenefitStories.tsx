import React from 'react';
import { Alert, View } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import { LevelBenefit } from '../../src/views/shared/LevelBenefit';
import { styles } from '../styles';

const onPress = () => Alert.alert('Alert', 'Level card clicked!');

export const OverviewStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Level Benefits</Text>
    <Text style={styles.text}>This component is used to render the level benefits of the game.</Text>
    <View style={styles.division} />
    <Text style={styles.title}>Level Boosted Benefits with action</Text>
    <View style={styles.componentContainer}>
      <LevelBenefit onPress={onPress}>
        <Text>Boosted Points Cashback!!!</Text>
      </LevelBenefit>
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>Level Non-boosted Benefits without action</Text>
    <View style={styles.componentContainer}>
      <LevelBenefit boosted={false}>
        <Text>Points Cashback!!!</Text>
      </LevelBenefit>
    </View>
  </View>
);

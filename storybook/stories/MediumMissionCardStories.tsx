import React from 'react';
import { Alert, View } from 'react-native';

import { MediumMissionCard } from '_modules/missions/components/MediumMissionCard';
import { Text } from '_components/Text';
import { getMission_1, getMission_2, getMission_3 } from '_test_utils/entities';

import { styles } from '../styles';
import { RenderGlobalContextWrapped } from './RenderGlobalContextWrapped';

const onPress = () => Alert.alert('Alert', 'Level card clicked!');
const mission1 = getMission_1(),
  mission2 = getMission_2(),
  mission3 = getMission_3();

export const OverviewStory = () => (
  <RenderGlobalContextWrapped>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Medium Mission Card</Text>
      <Text style={styles.text}>This component is used to render a mission card offer of the game.</Text>
      <View style={styles.division} />
      <Text style={styles.subtitle}>Medium Mission Card with indicator</Text>
      <View style={styles.componentContainer}>
        <MediumMissionCard onPress={onPress} mission={mission1} />
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>Medium Mission Card Dollars</Text>
      <View style={styles.componentContainer}>
        <MediumMissionCard onPress={onPress} mission={mission1} />
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>Medium Mission Card Points and Dollars</Text>
      <View style={styles.componentContainer}>
        <MediumMissionCard onPress={onPress} mission={mission2} />
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>Medium Mission Card Points</Text>
      <View style={styles.componentContainer}>
        <MediumMissionCard onPress={onPress} mission={mission3} />
      </View>
    </View>
  </RenderGlobalContextWrapped>
);
import React from 'react';
import { Alert, View, Text, FlatList } from 'react-native';

import { SmallMissionCard, Orientation } from '../../src/views/shared/SmallMissionCard';
import { getMission_1, getMission_2, getMission_3 } from '../../src/test-utils/entities';

import { styles } from '../styles';
import { RenderGlobalContextWrapped } from './RenderGlobalContextWrapped';

export const OverviewStory = () => {
  const missionList = [getMission_1(), getMission_3(), getMission_2()];

  const onPress = () => Alert.alert('Event detected', 'Mission card pressed');

  return (
    <RenderGlobalContextWrapped>
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Small Mission Card</Text>
        <Text style={styles.text}>This component is used to render a small mission card.</Text>
        <View style={styles.division} />
        <Text style={styles.subtitle}>Horizontal</Text>
        <View style={styles.componentContainer}>
          <FlatList
            data={missionList}
            renderItem={({ item: mission }) => (
              <View style={{ margin: 10 }}>
                <SmallMissionCard onPress={onPress} mission={mission} />
              </View>
            )}
            horizontal={true}
            keyExtractor={mission => mission.offerId}
          />
          <FlatList
            data={missionList}
            renderItem={({ item: mission }) => (
              <View style={{ margin: 10 }}>
                <SmallMissionCard onPress={onPress} mission={mission} />
              </View>
            )}
            horizontal={true}
            keyExtractor={mission => mission.offerId}
          />
        </View>
        <View style={styles.division} />
        <Text style={styles.subtitle}>Vertical</Text>
        <View style={styles.componentContainer}>
          <FlatList
            data={missionList}
            renderItem={({ item: mission }) => (
              <View style={{ margin: 10 }}>
                <SmallMissionCard onPress={onPress} mission={mission} orientation={Orientation.VERTICAL} />
              </View>
            )}
            horizontal={true}
            keyExtractor={mission => mission.offerId}
          />
          <FlatList
            data={missionList}
            renderItem={({ item: mission }) => (
              <View style={{ margin: 10 }}>
                <SmallMissionCard onPress={onPress} mission={mission} orientation={Orientation.VERTICAL} />
              </View>
            )}
            horizontal={true}
            keyExtractor={mission => mission.offerId}
          />
        </View>
      </View>
    </RenderGlobalContextWrapped>
  );
};

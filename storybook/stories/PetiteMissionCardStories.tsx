import React from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';

import { styles } from '../styles';
import { PetiteMissionCard } from '../../src/views/shared/PetiteMissionCard';
import { OfferModel } from '../../src/models';
import { RenderGlobalContextWrapped } from './RenderGlobalContextWrapped';

const onPress = () => Alert.alert('Alert', 'Petite Mission Card Pressed!');

export const OverviewStory = () => (
  <RenderGlobalContextWrapped>
    <ScrollView style={styles.subcontainer}>
      <Text style={styles.title}>Petite Mission Card</Text>

      <Text style={styles.subtitle}>With indicator</Text>
      <View style={styles.componentContainer}>
        <PetiteMissionCard
          image="https://www.vodafone.es/c/particulares/es/acceso-area-privada/mvf/static/img/modules/backgrounds/New_VF_Icon_RGB_RED.png"
          category={OfferModel.ProgramSubCategory.GROCERY}
          onPress={onPress}
        />
      </View>
      <View style={styles.division} />

      <Text style={styles.subtitle}>With an image</Text>
      <View style={styles.componentContainer}>
        <PetiteMissionCard
          image="https://www.vodafone.es/c/particulares/es/acceso-area-privada/mvf/static/img/modules/backgrounds/New_VF_Icon_RGB_RED.png"
          category={OfferModel.ProgramSubCategory.GROCERY}
          onPress={onPress}
        />
      </View>
      <View style={styles.division} />

      <Text style={styles.subtitle}>With a category fallback</Text>
      <View style={styles.componentContainer}>
        <PetiteMissionCard image={null} category={OfferModel.ProgramSubCategory.GROCERY} onPress={onPress} />
      </View>
      <View style={styles.division} />

      <Text style={styles.subtitle}>Many in a row</Text>
      <View style={[styles.componentContainer, { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }]}>
        {Object.values(OfferModel.ProgramSubCategory).map(category => (
          <View key={category} style={{ margin: 5 }}>
            <PetiteMissionCard image={null} category={category} onPress={() => Alert.alert(category)} />
          </View>
        ))}
      </View>
    </ScrollView>
  </RenderGlobalContextWrapped>
);

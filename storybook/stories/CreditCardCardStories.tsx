import React from 'react';
import { Alert, View } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import { CreditCard } from '../../src/views/shared/CreditCard';
import { styles } from '../styles';
import { RenderGlobalContextWrapped } from './RenderGlobalContextWrapped';

const onPress = () => Alert.alert('Alert', 'Level card clicked!');

export const OverviewStory = () => (
  <RenderGlobalContextWrapped>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Large Credit Card</Text>
      <Text style={styles.text}>This component is used to render a description about how to see points or get a credit card.</Text>

      <View style={styles.division} />
      <Text style={styles.subtitle}>User with credit card</Text>
      <View style={styles.componentContainer}>
        <CreditCard onPress={onPress} userHasSywCard={true} />
      </View>
      <View style={styles.division} />

      <Text style={styles.subtitle}>User without credit card</Text>
      <View style={styles.componentContainer}>
        <CreditCard onPress={onPress} userHasSywCard={false} />
      </View>
      <View style={styles.division} />
    </View>
  </RenderGlobalContextWrapped>
);

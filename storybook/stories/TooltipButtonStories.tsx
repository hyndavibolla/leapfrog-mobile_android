import React from 'react';
import { Alert, View } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import { TooltipButton } from '../../src/views/shared/TooltipButton';
import { styles } from '../styles';

const onPress = () => Alert.alert('Alert', 'Button clicked! ');

export const OverviewStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Tooltip Button</Text>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Flashing</Text>
      <View style={[styles.componentContainer]}>
        <TooltipButton onPress={onPress} flashy={true} />
      </View>
    </View>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Not flashing</Text>
      <View style={[styles.componentContainer]}>
        <TooltipButton onPress={onPress} flashy={false} />
      </View>
    </View>
  </View>
);

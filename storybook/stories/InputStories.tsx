import React from 'react';
import { View } from 'react-native';
import { useState } from '@storybook/addons';

import { Text } from '../../src/views/shared/Text';

import { styles } from '../styles';
import { Input } from '../../src/views/shared/Input';

export const InputStory = () => {
  const [value, setValue] = useState('');
  return (
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Input</Text>
      <View style={styles.componentContainer}>
        <Input value={value} onChangeText={setValue} placeholder="regular input" />
      </View>
      <View style={styles.division} />
      <Text style={styles.title}>Invalid Input</Text>
      <View style={styles.componentContainer}>
        <Input value={value} onChangeText={setValue} isInvalid={true} placeholder="invalid input" />
      </View>
    </View>
  );
};

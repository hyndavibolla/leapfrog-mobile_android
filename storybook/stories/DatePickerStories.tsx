import React from 'react';
import { View } from 'react-native';
import { useState } from '@storybook/addons';

import { Text } from '../../src/views/shared/Text';

import { styles } from '../styles';
import { DatePicker } from '../../src/views/shared/DatePicker';

export const DatePickerStory = () => {
  const [date, setDate] = useState(null);
  return (
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Date Picker</Text>
      <View style={styles.componentContainer}>
        <DatePicker date={date} onChangeDate={setDate} />
      </View>
      <View style={styles.division} />
      <Text style={styles.title}>Invalid Date Picker</Text>
      <View style={styles.componentContainer}>
        <DatePicker date={date} onChangeDate={setDate} isInvalid={true} />
      </View>
    </View>
  );
};

import React from 'react';
import { View } from 'react-native';
import { useState } from '@storybook/addons';

import { Text } from '_components/Text';

import { styles } from '../styles';
import { CheckInput } from '_commons/components/molecules/CheckInput';
import { COLOR } from '_constants/styles';

export const CheckInputStory = () => {
  const [value, setValue] = useState(false);
  const onChange = checked => {
    setValue(checked);
  };

  return (
    <View style={styles.subcontainer}>
      <Text style={styles.title}>CheckInput</Text>
      <View style={styles.componentContainer}>
        <CheckInput label={'Circular Check Input'} value={value} onChange={onChange} />
      </View>
      <View style={styles.division} />
      <View style={styles.componentContainer}>
        <CheckInput label={'Square Check Input'} value={value} squareShape={true} selectedColor={COLOR.PRIMARY_BLUE} onChange={onChange} />
      </View>
    </View>
  );
};

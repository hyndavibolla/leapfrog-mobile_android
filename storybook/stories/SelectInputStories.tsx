import React, { useState } from 'react';
import { View } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import { styles } from '../styles';
import { SelectInput } from '../../src/views/shared/SelectInput';
import { RenderGlobalContextWrapped } from './RenderGlobalContextWrapped';

const Compo = () => {
  const [value, setValue] = useState();
  return (
    <SelectInput
      sheetContainerStyle={{ marginHorizontal: -10 }}
      selectedOption={value}
      onChange={setValue as any}
      optionList={[
        { value: '1', label: 'one' },
        { value: '2', label: 'two' },
        { value: '3', label: 'three' }
      ]}
      placeholder="Select an option"
    />
  );
};

export const SelectInputStory = () => {
  return (
    <RenderGlobalContextWrapped>
      <View style={styles.subcontainer}>
        <Text style={styles.title}>SelectInput</Text>
        <View style={styles.componentContainer}>
          <Compo />
        </View>
      </View>
    </RenderGlobalContextWrapped>
  );
};

import React from 'react';
import { View } from 'react-native';
import { boolean } from '@storybook/addon-knobs';
import { useState } from '@storybook/addons';

import { Text } from '_views/shared/Text';
import { NumberListInput } from '_modules/rewards/screens/RewardDetail/components/NumberListInput';
import { COLOR } from '_constants';

import { styles } from '../styles';

export const NumberListInputStory = () => {
  const [value, setValue] = useState('5');

  return (
    <>
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Number List Input</Text>
        <Text style={styles.text}>
          This component is used to show a list of available values ​​and also it gives the possibility to enter a value manually.
        </Text>
        <View style={styles.division} />
        <View style={[styles.componentContainer, { backgroundColor: COLOR.MEDIUM_GRAY }]}>
          <NumberListInput
            max={100}
            value={value}
            optionList={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 95, 100]}
            onChange={setValue}
            freeSelection={boolean('freeSelection', true)}
            disabled={boolean('disabled', false)}
            label="Set the gift card from $1 to $100"
            onMoveScroll={() => {}}
          />
        </View>
      </View>
    </>
  );
};

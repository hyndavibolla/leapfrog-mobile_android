import React from 'react';
import { View } from 'react-native';
import { Text } from '../../src/views/shared/Text';
import { number, text } from '@storybook/addon-knobs';

import { ProgressRing } from '../../src/views/shared/ProgressRing';

import { styles } from '../styles';

export const OverviewStory = () => (
  <>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Progress Ring</Text>
      <Text style={styles.text}>This component is used to render some level of the game.</Text>
      <View style={styles.division} />
      <View style={styles.componentContainer}>
        <ProgressRing
          width={number('width', 175)}
          strokeWidth={number('strokeWidth', 15)}
          progress={number('progress', 30)}
          label={text('label', '31,500')}
          sublabel={text('sublabel', 'OF 34,999')}
        />
      </View>
    </View>
  </>
);

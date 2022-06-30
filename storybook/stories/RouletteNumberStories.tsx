import React from 'react';
import { View } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import { styles } from '../styles';
import { RouletteNumber } from '../../src/views/shared/RouletteNumber';
import { useTimer } from '../../src/utils/useTimer';
import { Pill } from '../../src/views/shared/Pill/Pill';
import { RenderGlobalContextWrapped } from './RenderGlobalContextWrapped';

const Incremental = ({ interval }) => {
  const { timer } = useTimer(interval, true);
  return <RouletteNumber>{timer}</RouletteNumber>;
};

const Decremental = ({ interval }) => {
  const { timer } = useTimer(interval, true);
  return <RouletteNumber>{5000 - timer}</RouletteNumber>;
};

const IncrementalPill = ({ interval }) => {
  const { timer } = useTimer(interval, true);
  return (
    <View>
      <Pill style={{ alignSelf: 'center' }}>
        <RouletteNumber>{timer}</RouletteNumber>
      </Pill>
    </View>
  );
};

export const OverviewStory = () => (
  <RenderGlobalContextWrapped>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>RouletteNumber</Text>
      <Text style={styles.subtitle}>Plain</Text>
      <View style={styles.componentContainer}>
        <Incremental interval={2000} />
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>Decremental</Text>
      <View style={styles.componentContainer}>
        <Decremental interval={2500} />
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>With Pill</Text>
      <View style={styles.componentContainer}>
        <IncrementalPill interval={3000} />
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>With Large Number</Text>
      <View style={styles.componentContainer}>
        <View>
          <Pill style={{ alignSelf: 'center' }}>
            <RouletteNumber>{1237574}</RouletteNumber>
          </Pill>
        </View>
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>With Larger Number</Text>
      <View style={styles.componentContainer}>
        <View>
          <Pill style={{ alignSelf: 'center' }}>
            <RouletteNumber>{12375741232352324235}</RouletteNumber>
          </Pill>
        </View>
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>With Small Number</Text>
      <View style={styles.componentContainer}>
        <View>
          <Pill style={{ alignSelf: 'center' }}>
            <RouletteNumber>{1234}</RouletteNumber>
          </Pill>
        </View>
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>With Smaller Number</Text>
      <View style={styles.componentContainer}>
        <View>
          <Pill style={{ alignSelf: 'center' }}>
            <RouletteNumber>{123}</RouletteNumber>
          </Pill>
        </View>
      </View>
    </View>
  </RenderGlobalContextWrapped>
);

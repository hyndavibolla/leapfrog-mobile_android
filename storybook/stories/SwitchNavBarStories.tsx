import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '../../src/views/shared/Text';

import { SwitchNavBar, SwitchNavBarAlt } from '../../src/views/shared/SwitchNavBar';
import { styles } from '../styles';

const Wrapper2 = () => {
  const [active, setActive] = useState('2');
  const optionList = [
    { key: '1', label: 'one' },
    { key: '2', label: 'two' }
  ];

  return <SwitchNavBar onPress={key => setActive(key)} activeKey={active} optionList={optionList} />;
};

const Wrapper3 = () => {
  const [active, setActive] = useState('2');
  const optionList = [
    { key: '1', label: 'one' },
    { key: '2', label: 'two' },
    { key: '3', label: 'three' }
  ];

  return <SwitchNavBar onPress={key => setActive(key)} activeKey={active} optionList={optionList} />;
};

const Wrapper4 = () => {
  const [active, setActive] = useState('2');
  const optionList = [
    { key: '1', label: 'one' },
    { key: '2', label: 'two' },
    { key: '3', label: 'three' },
    { key: '4', label: 'four' }
  ];

  return <SwitchNavBar onPress={key => setActive(key)} activeKey={active} optionList={optionList} />;
};

const Wrapper5 = () => {
  const [active, setActive] = useState('2');
  const optionList = [
    { key: '1', label: '1' },
    { key: '2', label: '2' },
    { key: '3', label: '3' },
    { key: '4', label: '4' },
    { key: '5', label: '5' }
  ];

  return <SwitchNavBar onPress={key => setActive(key)} activeKey={active} optionList={optionList} />;
};

const Wrapper6 = () => {
  const [active, setActive] = useState(null);
  const optionList = [
    { key: 'male', label: 'Male' },
    { key: 'female', label: 'Female' }
  ];

  return <SwitchNavBarAlt onPress={key => setActive(key)} activeKey={active} optionList={optionList} />;
};

const Wrapper7 = () => {
  const [active, setActive] = useState(null);
  const optionList = [
    { key: 'male', label: 'Male' },
    { key: 'female', label: 'Female' }
  ];

  return <SwitchNavBarAlt onPress={key => setActive(key)} activeKey={active} optionList={optionList} isInvalid={true} />;
};

export const OverviewStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Switch NavBar</Text>
    <View style={styles.division} />
    <Text style={styles.subtitle}>With 2 values</Text>
    <View style={styles.componentContainer}>
      <Wrapper2 />
    </View>
    <View style={styles.division} />
    <Text style={styles.subtitle}>With 3 values</Text>
    <View style={styles.componentContainer}>
      <Wrapper3 />
    </View>
    <View style={styles.division} />
    <Text style={styles.subtitle}>With 4 values</Text>
    <View style={styles.componentContainer}>
      <Wrapper4 />
    </View>
    <View style={styles.division} />
    <Text style={styles.subtitle}>With 5 values</Text>
    <View style={styles.componentContainer}>
      <Wrapper5 />
    </View>
    <View style={styles.division} />
    <Text style={styles.subtitle}>As a segmented control input</Text>
    <View style={styles.componentContainer}>
      <Wrapper6 />
    </View>
    <View style={styles.division} />
    <Text style={styles.subtitle}>Invalid</Text>
    <View style={styles.componentContainer}>
      <Wrapper7 />
    </View>
  </View>
);

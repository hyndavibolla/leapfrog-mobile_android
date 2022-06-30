import React from 'react';
import { Alert, View } from 'react-native';
import { Text } from '../../src/views/shared/Text';

import { styles } from '../styles';
import { NavigationButton } from '../../src/views/shared/NavigationButton';
import { NavigationButtonType } from '../../src/views/shared/NavigationButton/NavigationButton';

const onPress = () => Alert.alert('Alert', 'Button clicked!');

export const Navbar = () => (
  <>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Navbar overview</Text>
      <View style={[styles.componentContainer, { flexDirection: 'row' }]}>
        <NavigationButton type={NavigationButtonType.STREAK} onPress={onPress} active={false} />
        <NavigationButton type={NavigationButtonType.EARN} onPress={onPress} active={false} />
        <NavigationButton type={NavigationButtonType.REWARD} onPress={onPress} active={false} />
        <NavigationButton type={NavigationButtonType.WALLET} onPress={onPress} active={false} />
      </View>
    </View>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Streak</Text>
      <Text style={styles.text}>active</Text>
      <View style={styles.componentContainer}>
        <NavigationButton type={NavigationButtonType.STREAK} onPress={onPress} active={true} />
      </View>
      <View style={styles.division} />
      <Text style={styles.text}>inactive</Text>
      <View style={styles.componentContainer}>
        <NavigationButton type={NavigationButtonType.STREAK} onPress={onPress} active={false} />
      </View>
    </View>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Earn</Text>
      <Text style={styles.text}>active</Text>
      <View style={styles.componentContainer}>
        <NavigationButton type={NavigationButtonType.EARN} onPress={onPress} active={true} />
      </View>
      <View style={styles.division} />
      <Text style={styles.text}>inactive</Text>
      <View style={styles.componentContainer}>
        <NavigationButton type={NavigationButtonType.EARN} onPress={onPress} active={false} />
      </View>
    </View>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Reward</Text>
      <Text style={styles.text}>active</Text>
      <View style={styles.componentContainer}>
        <NavigationButton type={NavigationButtonType.REWARD} onPress={onPress} active={true} />
      </View>
      <View style={styles.division} />
      <Text style={styles.text}>inactive</Text>
      <View style={styles.componentContainer}>
        <NavigationButton type={NavigationButtonType.REWARD} onPress={onPress} active={false} />
      </View>
    </View>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Wallet</Text>
      <Text style={styles.text}>active</Text>
      <View style={styles.componentContainer}>
        <NavigationButton type={NavigationButtonType.WALLET} onPress={onPress} active={true} />
      </View>
      <View style={styles.division} />
      <Text style={styles.text}>inactive</Text>
      <View style={styles.componentContainer}>
        <NavigationButton type={NavigationButtonType.WALLET} onPress={onPress} active={false} />
      </View>
    </View>
  </>
);

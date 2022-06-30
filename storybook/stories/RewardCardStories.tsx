import React from 'react';
import { Image, View } from 'react-native';

import { Text } from '_views/shared/Text';
import { RewardCard, RewardCardTheme } from '_modules/rewards/screens/RewardMain/components/RewardCard/RewardCard';
import { COLOR } from '_constants';

import { styles } from '../styles';

export const OverviewStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Reward CArd</Text>
    <Text style={styles.subtitle}>Light theme</Text>
    <View style={styles.componentContainer}>
      <RewardCard
        title="light reward"
        description="this is the light reward card"
        theme={RewardCardTheme.LIGHT}
        color={COLOR.SOFT_LIGHT_BLUE}
        image={<Image style={{ width: 95, height: 95 }} source={require('_assets/shared/avatarFallbackInverted.png')} />}
      />
    </View>
    <View style={styles.division} />
    <Text style={styles.subtitle}>Dark theme</Text>
    <View style={styles.componentContainer}>
      <RewardCard
        title="dark reward"
        description="this is the dark reward card"
        theme={RewardCardTheme.DARK}
        color={COLOR.PRIMARY_BLUE}
        image={<Image style={{ width: 95, height: 95 }} source={require('_assets/shared/avatarFallbackInverted.png')} />}
      />
    </View>
    <View style={styles.division} />
  </View>
);

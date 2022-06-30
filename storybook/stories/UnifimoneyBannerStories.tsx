import React from 'react';
import { View } from 'react-native';

import { Text } from '_components/Text';
import { UnifimoneyBanner } from '_commons/components/molecules/UnifimoneyBanner';
import { UnifimoneySmallBanner } from '_commons/components/molecules/UnifimoneySmallBanner';

import { styles } from '../styles';

function UnifimoneyBannerStory() {
  return (
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Banners Unifimoney</Text>
      <View style={styles.division} />
      <Text style={styles.subtitle}>banner</Text>
      <UnifimoneyBanner />
      <View style={styles.division} />
      <Text style={styles.subtitle}>small banner</Text>
      <UnifimoneySmallBanner />
    </View>
  );
}

export default UnifimoneyBannerStory;

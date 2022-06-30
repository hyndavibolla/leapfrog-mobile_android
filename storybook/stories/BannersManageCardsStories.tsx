import React from 'react';
import { View } from 'react-native';

import { Text } from '_views/shared/Text';
import { BannersManageCards } from '_views/shared/BannersManageCards';
import { BannerApplyAndUseNow } from '_components/BannersManageCards/BannerApplyAndUseNow';
import { COLOR } from '_constants/styles';

import { RenderGlobalContextWrapped } from './RenderGlobalContextWrapped';
import { styles } from '../styles';

export const BannersManageCardsStory = () => (
  <RenderGlobalContextWrapped>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Banners Manage Cards</Text>
      <Text style={styles.text}>This component is used to render the Banners Manage Cards.</Text>
      <View style={styles.division} />
      <Text style={styles.subtitle}>BannersManageCards</Text>
      <View style={[styles.componentContainer, { backgroundColor: COLOR.LIGHT_GRAY }]}>
        <BannersManageCards />
        <View style={styles.division} />
        <Text style={styles.subtitle}>Banner Apply And Use Now</Text>
        <BannerApplyAndUseNow />
      </View>
    </View>
  </RenderGlobalContextWrapped>
);

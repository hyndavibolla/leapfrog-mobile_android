import React from 'react';
import { View } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { BannerApplyAndUseNow } from '_components/BannersManageCards/BannerApplyAndUseNow';
import { Text } from '_components/Text';

import { styles } from './styles';

const BannerApplyForCardWithDescription = () => {
  const { getTestIdProps } = useTestingHelper('banner-apply-card');

  return (
    <View {...getTestIdProps('container')}>
      <Text style={styles.title}>Shop Your Way Mastercard®‡</Text>
      <BannerApplyAndUseNow />
      <Text style={styles.lightDescriptionText}>We will automatically link your card to Cardlink to get you even more points on local restaurants.</Text>
    </View>
  );
};

export default BannerApplyForCardWithDescription;

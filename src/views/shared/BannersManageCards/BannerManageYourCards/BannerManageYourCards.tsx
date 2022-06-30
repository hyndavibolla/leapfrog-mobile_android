import React, { memo } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { CONTAINER_STYLE, FONT_SIZE, ICON, ROUTES } from '_constants';

import CardDarkBlueIcon from '_assets/shared/cardIconDarkBlue.svg';

import { styles } from './styles';
import { Icon } from '_commons/components/atoms/Icon';

const BannerManageYourCards = () => {
  const { navigate } = useNavigation();
  const { getTestIdProps } = useTestingHelper('banner-manage-your-card');
  return (
    <TouchableHighlight underlayColor="transparent" {...getTestIdProps('container')} onPress={() => navigate(ROUTES.MAIN_TAB.WALLET)}>
      <View style={[CONTAINER_STYLE.shadow, styles.container]}>
        <View style={styles.imageContainer}>
          <CardDarkBlueIcon width={40} height={40} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Manage your cards</Text>
          <Text style={styles.textContent}>Link cards and view your points{'\n'}history</Text>
          <View style={styles.button}>
            <Text style={styles.textButton} {...getTestIdProps('text-button')}>
              Let’s go
            </Text>
            <Icon name={ICON.ARROW_RIGHT} size={FONT_SIZE.BIG} />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default memo(BannerManageYourCards);

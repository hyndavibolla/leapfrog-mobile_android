import React, { memo } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CONTAINER_STYLE, ROUTES } from '../../../constants';

import { useTestingHelper } from '../../../utils/useTestingHelper';

import { styles } from './styles';

const BannerAddNewCard = () => {
  const { navigate } = useNavigation();
  const { getTestIdProps } = useTestingHelper('banner-add-new-card');
  return (
    <TouchableHighlight underlayColor="transparent" {...getTestIdProps('container')} onPress={() => navigate(ROUTES.IN_STORE_OFFERS.CARD_LINK)}>
      <View style={[CONTAINER_STYLE.shadow, styles.container]}>
        <View style={styles.creditCardAndText}>
          <View style={styles.backgroundIcon}>
            <Text style={styles.lockIcon}>🔓</Text>
          </View>
          <Text style={styles.cardTitle}>Link your card to eat and earn now</Text>
        </View>
        <Text style={styles.bodyText}>Unlock offers on local restaurants, cafes, and bars near you now. It’s free and easy. Link your card to start.</Text>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonInner}>
            <Text style={styles.buttonTextSecondLevel}>Add Card</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default memo(BannerAddNewCard);

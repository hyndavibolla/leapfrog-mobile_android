import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Icon } from '_commons/components/atoms/Icon';

import { useTestingHelper } from '_utils/useTestingHelper';

import { ICON } from '_constants/icons';
import { COLOR, FONT_SIZE } from '_constants/styles';

import { styles } from './styles';

function UnifimoneySmallBanner() {
  const { getTestIdProps } = useTestingHelper('unifimoney-small-banner');

  return (
    <LinearGradient colors={[COLOR.PRIMARY_BLUE, COLOR.SOFT_PRIMARY_LIGHT_BLUE]} style={styles.container} {...getTestIdProps('container')}>
      <ImageBackground source={require('_assets/shared/categoryBackgroundFallback.png')} resizeMode="cover" style={styles.image}>
        <View style={styles.circleContainer}>
          <View style={[styles.circle, styles.leftCircle]}>
            <Icon name={ICON.MAX} color={COLOR.PRIMARY_BLUE} size={FONT_SIZE.REGULAR_2X} backgroundStyle={styles.maxIcon} />
          </View>
          <View style={styles.circle}>
            <Icon name={ICON.UNIFIMONEY} color={COLOR.MEDIUM_GREEN} size={FONT_SIZE.SMALLER_2X} />
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Ready to invest?</Text>
          <Text style={styles.subtitle}>Redeem your points for crypto, or metals.</Text>
        </View>
      </ImageBackground>
    </LinearGradient>
  );
}

export default UnifimoneySmallBanner;

import React, { memo } from 'react';
import { StatusBar, View } from 'react-native';
import LottieView from 'lottie-react-native';

import { COLOR } from '_constants';
import { styles } from './styles';

export const Splash = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.PRIMARY_BLUE} />
      <LottieView loop autoPlay style={styles.animation} source={require('_assets/splash/splash-animation.json')} />
    </View>
  );
};

export default memo(Splash);

import React, { memo, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { StackHeaderProps, StackNavigationProp } from '@react-navigation/stack';

import { BoxCard } from '_components/BoxCard';
import { WebView } from '_components/WebView';
import { NavigationHeader } from '_components/NavigationHeader';
import { ENV } from '_constants';
import { styles } from './styles';

export interface Props {
  route: { params: { url: string; cardNumber: string; pin: string } };
  navigation: StackNavigationProp<any>;
}

export const GiftCardBalance = ({ route, navigation }: Props) => {
  const { MAX_LOAD_ATTEMPTS: maxLoadAttempts, ATTEMPT_DELAY_MS: attemptDelay } = ENV.WEBVIEWS;
  const { url, cardNumber, pin } = route.params;

  const header = useCallback((props: StackHeaderProps) => <NavigationHeader {...props} showGoBackCrossBtnByOption />, []);

  useEffect(() => {
    navigation.setOptions({ header });
  }, [header, navigation]);

  return (
    <>
      <View style={styles.cardInfoContent}>
        <BoxCard title="CARD NUMBER" value={cardNumber} showCopy showCheckOnCopy />
        <BoxCard title="PIN" value={pin} showCopy showCheckOnCopy />
      </View>
      <WebView retry={{ attempts: maxLoadAttempts, delayMs: attemptDelay }} shouldShowLoader source={{ uri: url }} />
    </>
  );
};

export default memo(GiftCardBalance);

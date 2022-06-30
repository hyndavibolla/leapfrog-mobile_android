import React, { useCallback, useContext } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { CONTAINER_STYLE, ENV, ForterActionType, ROUTES, TealiumEventType } from '_constants';
import { Button } from '_components/Button';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';

import { styles } from './styles';

const BannerApplyAndUseNow = () => {
  const {
    state: {
      core: { lastRouteKey }
    }
  } = useContext(GlobalContext);
  const { navigate } = useNavigation();
  const { getTestIdProps } = useTestingHelper('banner-apply-and-use');
  const { trackUserEvent } = useEventTracker();

  const getInitiateTypeByRoute = route => {
    const types = {
      [ROUTES.WALLET.REDEMPTIONS]: TealiumEventType.INITIATE_WALLET,
      [ROUTES.WALLET.CREDIT_CARDS]: TealiumEventType.INITIATE_WALLET,
      [ROUTES.MAIN_TAB.STREAK]: TealiumEventType.INITIATE_MISSIONS,
      [ROUTES.IN_STORE_OFFERS.OFFER_DETAIL]: TealiumEventType.INITIATE_LOCAL_OFFERS,
      default: TealiumEventType.INITIATE_CITI_APPLICATION
    };
    return types[route] || types.default;
  };

  const getTermsTypeByRoute = route => {
    const types = {
      [ROUTES.WALLET.REDEMPTIONS]: TealiumEventType.TERMS_WALLET,
      [ROUTES.WALLET.CREDIT_CARDS]: TealiumEventType.TERMS_WALLET,
      [ROUTES.MAIN_TAB.STREAK]: TealiumEventType.TERMS_MISSIONS,
      [ROUTES.IN_STORE_OFFERS.OFFER_DETAIL]: TealiumEventType.TERMS_LOCAL_OFFERS,
      default: TealiumEventType.TERMS_OTHER
    };
    return types[route] || types.default;
  };

  const onApplyingForCardPress = useCallback(() => {
    trackUserEvent(TealiumEventType.CARD_APPLICATION, { event_type: getInitiateTypeByRoute(lastRouteKey) }, ForterActionType.TAP);
    navigate(ROUTES.FUSION_VIEWER, { title: 'SHOP YOUR WAY MASTERCARD®', routeToReturn: ROUTES.MAIN_TAB.WALLET });
  }, [lastRouteKey, navigate, trackUserEvent]);

  const onSeeDetails = useCallback(() => {
    trackUserEvent(TealiumEventType.CARD_APPLICATION, { event_type: getTermsTypeByRoute(lastRouteKey) }, ForterActionType.TAP);
    navigate(ROUTES.COMMON_WEB_VIEW.MAIN, {
      title: 'SHOP YOUR WAY MASTERCARD®',
      url: `${ENV.SYW_URL}card?p=terms`
    });
  }, [lastRouteKey, navigate, trackUserEvent]);

  return (
    <View style={[CONTAINER_STYLE.shadow, styles.container]} {...getTestIdProps('container')}>
      <Image source={require('_assets/credit-card/creditCard2.png')} style={styles.image as any} resizeMode="contain" />
      <View style={styles.content}>
        <Text style={styles.textContainer}>
          Earn a <Text style={styles.numberText}>$75</Text> statement credit for every $500 spent, up to $225, with eligible purchases†.
        </Text>
        <TouchableOpacity onPress={onSeeDetails} {...getTestIdProps('text-button')}>
          <Text style={styles.textButton}>‡†See details and exclusions</Text>
        </TouchableOpacity>
        <Button
          style={styles.button}
          innerContainerStyle={styles.innerButton}
          textStyle={styles.buttonText}
          onPress={onApplyingForCardPress}
          {...getTestIdProps('apply-button')}
        >
          Learn more
        </Button>
      </View>
    </View>
  );
};

export default BannerApplyAndUseNow;

import React, { memo, useContext, useEffect, useMemo } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Button } from '_components/Button';
import { EnvBanner } from '_components/EnvBanner';
import { Spinner } from '_components/Spinner';
import { Text } from '_components/Text';
import { ToastType } from '_components/Toast';
import { ConversionEventType, ENV } from '_constants';
import { useAuthentication, useLogout } from '_state_mgmt/auth/hooks';
import { useEventTracker, useToast } from '_state_mgmt/core/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import getInitialActionNavigation from '_utils/getInitialActionNavigation';
import { useAsyncCallback } from '_utils/useAsyncCallback';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props {
  navigation: StackNavigationProp<any>;
  route?: { params?: { token?: string } };
}

export const LoginAuth0 = ({ navigation }: Props) => {
  const { getTestIdProps } = useTestingHelper('login');
  const { deps, state } = useContext(GlobalContext);
  const [authenticate, isAuthenticating, , authenticationResponse] = useAuthentication();
  const [onSoftLogout] = useLogout(true);
  const { trackConversionEvent } = useEventTracker();
  const [onGetInitialURL, , , initialUrl] = useAsyncCallback<any, string>(deps.nativeHelperService.linking.getInitialURL, []);
  const { showToast } = useToast();

  const isAndroid = useMemo(() => deps.nativeHelperService.platform.OS === 'android', [deps.nativeHelperService.platform]);

  useEffect(() => {
    trackConversionEvent(ConversionEventType.LOGIN_ATTEMPT, {});
    onGetInitialURL();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleAuth = async () => {
      const forcedToLogout = await deps.nativeHelperService.storage.get(ENV.STORAGE_KEY.FORCED_TO_LOGOUT);
      if (!forcedToLogout) {
        authenticate();
      } else {
        await deps.nativeHelperService.storage.remove(ENV.STORAGE_KEY.FORCED_TO_LOGOUT);
        showToast({
          type: ToastType.ERROR_WITHOUT_ICON,
          title: 'You’ve been logged out for security reasons',
          children: 'Please log in again to continue earning.',
          showCloseBtn: false,
          titleStyle: styles.toastTitle,
          descriptionStyle: styles.toastDescription,
          positionFromBottom: deps.nativeHelperService.platform.select({ ios: 24, android: 4 })
        });
      }
    };

    handleAuth();
  }, [authenticate, showToast, deps.nativeHelperService.storage, deps.nativeHelperService.platform]);

  useEffect(() => {
    if (!authenticationResponse) return;
    const { action } = getInitialActionNavigation(true, state.core.hasSeenOnboarding, state.core.showForcedUpdateScreen, {
      initialUrl,
      deepLink: state.core.deepLink
    });
    navigation.dispatch(action);
  }, [authenticationResponse, initialUrl, navigation, state.core.deepLink, state.core.hasSeenOnboarding, state.core.showForcedUpdateScreen]);

  useEffect(() => {
    onSoftLogout();
  }, [onSoftLogout]);

  if (isAuthenticating || !!authenticationResponse) {
    return (
      <View style={styles.spinnerContainer}>
        <Spinner />
      </View>
    );
  }

  return (
    <>
      <EnvBanner />
      <View style={styles.loginContainer} {...getTestIdProps('container')}>
        <View style={[styles.loginContent, isAndroid && styles.loginAlignmentContainer]}>
          <Image source={require('../../assets/shared/loginImg.png')} style={{ width: '100%', resizeMode: 'contain' }} />
          <Text style={styles.loginTitle}>Welcome</Text>
          <Text style={styles.loginText}>To start earning in your favorite stores, we need you to login or register</Text>
          <View style={styles.buttonContainer}>
            <Button
              {...getTestIdProps('login-btn')}
              innerContainerStyle={styles.innerButtonContainer}
              textStyle={styles.buttonText}
              onPress={() => authenticate()}
            >
              Login
            </Button>
            <TouchableOpacity {...getTestIdProps('register-btn')} onPress={() => authenticate()}>
              <Text style={styles.registerText}>or register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default memo(LoginAuth0);

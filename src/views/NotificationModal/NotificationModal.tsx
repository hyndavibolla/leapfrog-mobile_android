import React, { memo, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { COLOR } from '_constants';
import Step1 from '_assets/notification-modal/step1@3x.svg';
import Step2 from '_assets/notification-modal/step2@3x.svg';
import Step3 from '_assets/notification-modal/step3@3x.svg';
import Step4 from '_assets/notification-modal/step4@3x.svg';
import { GlobalContext } from '_state_mgmt/GlobalState';

import { Button } from '../shared/Button';
import { styles } from './styles';

export interface Props {
  onConfirm?: () => Promise<void>;
  onCancel?: () => void;
  arePNRejected: boolean;
}

export const NotificationModal = ({ onConfirm, onCancel, arePNRejected }: Props) => {
  const { deps } = useContext(GlobalContext);
  const { getTestIdProps } = useTestingHelper('notification-modal');
  const [showRecoveryFlow, setShowRecoveryFlow] = useState(false);

  const onConfirmPN = () => {
    if (!arePNRejected) return onConfirm();
    setShowRecoveryFlow(true);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor={COLOR.PRIMARY_BLUE} barStyle="dark-content" />
      {!showRecoveryFlow ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View {...getTestIdProps('animation-container')} style={[styles.lottieContainer]}>
            <LottieView source={require('_assets/animations/permissions/1')} autoPlay />
          </View>
          <View>
            <Text style={styles.title}>Turn on notifications so you don’t miss offers!</Text>
            <Text style={styles.text}>
              Receive personalized notifications on new offers and specials! Be the first to hear about new ways to earn and the new brands coming your way!
            </Text>
          </View>
          <View>
            <Button textStyle={styles.buttonText} style={styles.buttonItem} {...getTestIdProps('accept-btn')} onPress={onConfirmPN}>
              Allow
            </Button>
            <Button
              textStyle={styles.buttonText}
              containerColor={COLOR.LIGHT_GRAY}
              textColor={COLOR.PRIMARY_BLUE}
              {...getTestIdProps('cancel-btn')}
              onPress={onCancel}
            >
              Don’t allow
            </Button>
          </View>
        </ScrollView>
      ) : (
        <View>
          <Image style={styles.sywLogo as any} source={require('../../assets/shared/swyLogo.png')} resizeMode="cover" />
          <Text style={styles.titlePushNotification}>We'll help you activate Push Notifications</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <Step1 />
              <Text style={styles.stepText}>1. Please open your </Text>
              <TouchableOpacity onPress={() => deps.nativeHelperService.linking.openURL('app-settings:')}>
                <Text style={styles.linkToSettings} {...getTestIdProps('settings-btn')}>
                  phone settings.
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.step}>
              <Step2 />
              <Text style={styles.stepText}>2. Find the notifications icon.</Text>
            </View>
            <View style={styles.step}>
              <Step3 />
              <Text style={styles.stepText}>3. Turn on notifications.</Text>
            </View>
            <View style={styles.step}>
              <Step4 />
              <Text style={styles.stepText}>4. Choose the setting you like the most. We strongly recommend having "lock screen" active.</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default memo(NotificationModal);

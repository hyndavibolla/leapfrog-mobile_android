import React, { memo, useContext, useEffect, useRef } from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

import SYWLogo from '_assets/shared/sywLogo.svg';
import PointsAnimation from '_assets/animations/tutorial/points.json';
import MissionsAnimation from '_assets/animations/tutorial/missions.json';
import localOffersAnimation from '_assets/animations/tutorial/localOffers.json';
import RewardsAnimation from '_assets/animations/tutorial/rewards.json';
import { Icon } from '_commons/components/atoms/Icon';
import { ICON } from '_constants/icons';
import { COLOR, FONT_SIZE } from '_constants/styles';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useLocationPermission } from '_utils/useLocationPermission';
import { styles } from './styles';

export interface Props {
  step: number;
  handleNextStep: () => void;
}

const styleSYW = Platform.select({ android: '15 -34 100 60', ios: '15 -28 100 60' });

const StepItems = ({ step, handleNextStep }: Props) => {
  const { getTestIdProps } = useTestingHelper('step-items');
  const animation = useRef(null);
  const { isLocationAvailable, isLocationBlocked, handleLocationPermission } = useLocationPermission();
  const {
    deps: {
      nativeHelperService: {
        reactNativePermission: {
          RESULTS: { GRANTED }
        }
      }
    }
  } = useContext(GlobalContext);

  useEffect(() => {
    if (animation.current) {
      animation.current.play();
    }
  }, [step]);

  const step1 = (
    <>
      <View style={styles.container} {...getTestIdProps('step1')}>
        <Text style={styles.title}>What are points?</Text>
        <Text style={styles.subtitle}>
          Points are your rewards for any purchases you make on <SYWLogo viewBox={styleSYW} fill={COLOR.PRIMARY_BLUE} />
        </Text>
      </View>
      <LottieView ref={animation} style={styles.animation} source={PointsAnimation} loop />
    </>
  );

  const step2 = (
    <>
      <View style={styles.container} {...getTestIdProps('step2')}>
        <Text style={styles.title}>How do Missions work?</Text>
        <View />
        <Text style={styles.subtitle}>
          Missions are a great way to earn extra points.
          {'\n'}
          Make 3 purchases on <Text style={styles.bold}>Groceries & Delivery</Text> and earn <Text style={styles.bold}>3000</Text> extra points.
        </Text>
      </View>
      <LottieView ref={animation} style={styles.animation} source={MissionsAnimation} loop />
    </>
  );

  const step3 = (
    <>
      <View style={styles.container} {...getTestIdProps('step3')}>
        <Text style={styles.title}>What are Local Offers?</Text>
        <Text style={styles.subtitle}>Local Offers reward you with points for dining out at great restaurants near you.</Text>
        <TouchableOpacity
          disabled={isLocationAvailable || isLocationBlocked}
          onPress={async () => {
            const status = await handleLocationPermission();
            if (status !== GRANTED) handleNextStep();
          }}
          {...getTestIdProps('step3-action')}
        >
          <View style={styles.bodyLink}>
            {isLocationAvailable ? (
              <>
                <Icon color={COLOR.PURPLE} name={ICON.PIN_MAP} size={FONT_SIZE.TINY} />
                <Text style={[styles.link, styles.linked]} {...getTestIdProps('step3-isLocation')}>
                  Location enabled successfully
                </Text>
              </>
            ) : (
              <>
                <Icon color={isLocationBlocked ? COLOR.DARK_GRAY : COLOR.PRIMARY_BLUE} name={ICON.PIN_MAP} size={FONT_SIZE.TINY} />
                <Text style={[styles.link, { color: isLocationBlocked ? COLOR.DARK_GRAY : COLOR.PRIMARY_BLUE }]} {...getTestIdProps('step3-notIsLocation')}>
                  Enable your location here
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <LottieView ref={animation} style={styles.animation} source={localOffersAnimation} loop />
    </>
  );

  const step4 = (
    <>
      <View testID="step4" style={styles.container}>
        <Text style={styles.title}>Use points to buy Gift Cards</Text>
        <Text style={styles.subtitle}>
          Get <Text style={styles.bold}>$1</Text> for every <Text style={styles.bold}>1000</Text> points and redeem them for Gift Cards from more than 100
          brands!
        </Text>
      </View>
      <LottieView ref={animation} style={styles.animation} source={RewardsAnimation} loop />
    </>
  );

  const steps = [step1, step2, step3, step4];

  return step > steps.length - 1 ? null : steps[step];
};

export default memo(StepItems);

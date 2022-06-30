import React, { memo, useContext, useCallback } from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { Icon } from '_commons/components/atoms/Icon';
import Rocket from '_assets/tutorial/rocket.json';
import { Button } from '_components/Button';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { initialState as userInitialState } from '_state_mgmt/user/state';
import { actions } from '_state_mgmt/core/actions';
import { COLOR, FONT_SIZE, ICON, TutorialFrom } from '_constants';

import { styles } from './styles';

export interface Props {
  onSkipPress: () => void;
  onWatchPress: () => void;
}

const WelcomeTutorialBanner = ({ onSkipPress, onWatchPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('welcome-tutorial-banner');
  const {
    state: {
      user: {
        currentUser: { firstName }
      }
    },
    dispatch
  } = useContext(GlobalContext);

  const handleConfirmButton = useCallback(() => {
    dispatch(actions.setTutorialFrom(TutorialFrom.TUTORIAL_BANNER));
    onWatchPress();
  }, [dispatch, onWatchPress]);

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <View style={styles.topContainer}>
        <Text style={styles.title} {...getTestIdProps('title')}>
          {`Welcome${firstName && firstName !== userInitialState.currentUser.firstName ? ', ' + firstName : ''}!`}
        </Text>
        <View style={styles.animationContainer}>
          <Text style={styles.animationTitle} {...getTestIdProps('animation-title')}>
            Thanks for joining
          </Text>
        </View>
        <View style={styles.lottieContainer}>
          <LottieView source={Rocket} resizeMode={'cover'} loop autoPlay style={styles.animation} />
        </View>
        <Text style={styles.subtitle} {...getTestIdProps('subtitle')}>
          Learn how to earn points and redeem them for Gift Cards from your favorite brands!
        </Text>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          innerContainerStyle={[styles.button, styles.buttonTransparent]}
          textStyle={styles.buttonText}
          onPress={onSkipPress}
          textColor={COLOR.WHITE}
          {...getTestIdProps('skip-button')}
        >
          Skip
        </Button>

        <Button
          innerContainerStyle={[styles.button, styles.buttonRight]}
          textStyle={styles.buttonText}
          onPress={handleConfirmButton}
          {...getTestIdProps('confirm-button')}
        >
          <View style={styles.buttonContent}>
            <Text style={[styles.buttonText, styles.buttonShow]}>Show me how</Text>
            <Icon size={FONT_SIZE.SMALL} name={ICON.ARROW_RIGHT} color={COLOR.PRIMARY_BLUE} />
          </View>
        </Button>
      </View>
    </View>
  );
};

export default memo(WelcomeTutorialBanner);

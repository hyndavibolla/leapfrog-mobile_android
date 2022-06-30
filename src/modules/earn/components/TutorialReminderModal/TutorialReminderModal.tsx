import React, { memo, useCallback, useContext, useState, useEffect } from 'react';
import { View, Image, ImageStyle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Modal, ModalSize } from '_components/Modal';
import { Text } from '_components/Text';
import { Button } from '_components/Button';
import { COLOR, ENV, TealiumEventType, ForterActionType, UxObject, PageNames, TutorialFrom } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { actions } from '_state_mgmt/core/actions';
import { ITutorialStatus } from '_models/general';
import { getDateDiffInDays } from '_utils/getDateDiffInDays';
import { useEventTracker } from '_state_mgmt/core/hooks';

import { styles } from './styles';

export const TutorialReminderModal = () => {
  const { getTestIdProps } = useTestingHelper('tutorial-reminder-modal');
  const {
    state: {
      core: { isTutorialAvailable }
    },
    deps,
    dispatch
  } = useContext(GlobalContext);
  const { trackUserEvent } = useEventTracker();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      const getTutorialDate = async () => {
        const tutorialStatus = await deps.nativeHelperService.storage.get<ITutorialStatus>(ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS);

        if (tutorialStatus?.date) {
          const days = getDateDiffInDays(new Date(tutorialStatus.date), new Date());
          if (days > 7) setIsVisible(true);
        }
      };

      getTutorialDate();
    }, [deps.nativeHelperService.storage])
  );

  useEffect(() => {
    if (isVisible)
      trackUserEvent(
        TealiumEventType.TUTORIAL,
        {
          page_name: PageNames.MAIN.EARN,
          event_name: TealiumEventType.TUTORIAL,
          uxObject: UxObject.TOOLTIP_OVERLAY,
          event_type: TealiumEventType.TUTORIAL_REMINDER_SHOWN
        },
        ForterActionType.TAP
      );
  }, [trackUserEvent, isVisible]);

  const trackSkipTutorial = () => {
    trackUserEvent(
      TealiumEventType.TUTORIAL,
      {
        page_name: PageNames.MAIN.EARN,
        event_name: TealiumEventType.TUTORIAL,
        uxObject: UxObject.BUTTON,
        event_detail: JSON.stringify({ skipped_on: 'tutorial_reminder' }),
        event_type: TealiumEventType.TUTORIAL_SKIPPED
      },
      ForterActionType.TAP
    );
  };

  const handleDismiss = async () => {
    setIsVisible(false);
    const newStatus = {
      isBannerWatched: true,
      date: undefined
    };
    await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS, newStatus);
  };

  const handleSkip = () => {
    trackSkipTutorial();
    handleDismiss();
  };

  const handleWatchTutorial = () => {
    handleDismiss();
    dispatch(actions.setTutorialFrom(TutorialFrom.TUTORIAL_REMINDER));
    dispatch(actions.showTutorial(true));
  };

  return (
    <Modal visible={isVisible && isTutorialAvailable} size={ModalSize.DYNAMIC} onPressOutside={handleSkip} style={styles.modal}>
      <View style={styles.content} {...getTestIdProps('content')}>
        <Image source={require('_assets/tutorial/sevenDays.png')} style={styles.image as ImageStyle} />
        <Text style={styles.title}>Don’t you know how to earn points? Take a look at the tutorial👇</Text>
        <View style={styles.buttonContainer}>
          <Button innerContainerStyle={styles.button} textStyle={styles.buttonText} onPress={handleWatchTutorial} {...getTestIdProps('confirm-button')}>
            Watch tutorial
          </Button>
        </View>
        <View style={[styles.buttonContainer, styles.buttonContainerTransparent]}>
          <Button
            innerContainerStyle={[styles.button, styles.buttonTransparent]}
            textStyle={[styles.buttonText]}
            onPress={handleSkip}
            textColor={COLOR.PRIMARY_BLUE}
            {...getTestIdProps('cancel-button')}
          >
            No, thanks
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default memo(TutorialReminderModal);

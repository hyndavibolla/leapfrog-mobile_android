import React, { memo, ReactNode, useCallback, useState, useEffect, useContext, useRef, MutableRefObject } from 'react';
import { ScrollView, View, Modal, StyleProp, ViewStyle, Animated } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ICON } from '_constants/icons';
import { COLOR, FONT_SIZE } from '_constants/styles';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { actions } from '_state_mgmt/core/actions';

import { useEventTracker } from '_state_mgmt/core/hooks';
import { useTestingHelper } from '_utils/useTestingHelper';

import { TutorialElementPosition } from '_commons/models/Tutorial';
import { StepItems } from '_commons/components/organisms/StepItems';
import { Icon } from '_commons/components/atoms/Icon';
import { PointPill } from '_commons/components/molecules/PointPill';

import { Button } from '_components/Button';
import { EnvBanner } from '_components/EnvBanner/EnvBanner';
import { ConnectionBanner } from '_components/ConnectionBanner';

import { ForterActionType, PageNames, TealiumEventType, UxObject } from '_constants/eventTracking';

import { styles } from './styles';

export interface Props {
  children: ReactNode;
  refElement: MutableRefObject<ScrollView>;
  stepItems: Map<number, TutorialElementPosition>;
  stepItemParent: Map<number, TutorialElementPosition>;
  topHeight: number;
  onTutorialEnd?: () => void;
  onSkipCallback?: () => void;
}

const stepIndicator = (index: number, length: number) => (
  <View style={styles.steps}>
    {Array(length)
      .fill(0)
      .map((_, key) => (
        <View key={key} style={[styles.indicator, index === key && styles.selected]} />
      ))}
  </View>
);

const Tutorial = ({ children, refElement, topHeight, stepItems, stepItemParent, onTutorialEnd, onSkipCallback }: Props) => {
  const { getTestIdProps } = useTestingHelper('tutorial');
  const [step, setStep] = useState(1);
  const [component, setComponent] = useState<ReactNode>();
  const [style, setStyle] = useState<StyleProp<ViewStyle>>();
  const [scrollToDown, setScrollToDown] = useState<number>(0);
  const { trackUserEvent } = useEventTracker();
  const { top } = useSafeAreaInsets();

  const {
    state: {
      core: { isTutorialVisible },
      game: {
        current: {
          balance: { availablePoints }
        }
      }
    },
    dispatch
  } = useContext(GlobalContext);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const zIndexAnim = useRef(new Animated.Value(2)).current;
  const footerAnim = useRef(new Animated.Value(400)).current;

  const animateCycle = useCallback(
    ({ toValue, duration, toAnimate }: { toAnimate: Animated.Value; toValue: number; duration: number }, finalValue: number, finalDuration: number) => {
      Animated.timing(toAnimate, { toValue, duration, useNativeDriver: true }).start(() => {
        Animated.timing(toAnimate, { toValue: finalValue, duration: finalDuration, useNativeDriver: true }).start();
      });
    },
    []
  );

  const executeAnimations = useCallback(
    (durationFooter: number = 300) => {
      animateCycle({ toAnimate: footerAnim, toValue: 400, duration: durationFooter }, 0, 700);
      animateCycle({ toAnimate: zIndexAnim, toValue: 0, duration: 0 }, 2, 500);
      animateCycle({ toAnimate: fadeAnim, toValue: 0, duration: 0 }, 1, 1000);
    },
    [animateCycle, fadeAnim, footerAnim, zIndexAnim]
  );

  useEffect(() => {
    if (isTutorialVisible) {
      executeAnimations(0);
    }
  }, [executeAnimations, isTutorialVisible]);

  useEffect(() => {
    if (refElement && isTutorialVisible) {
      const element = stepItems.get(step);
      if (element) {
        const { parentId, children: elementChildren, style: elementStyle, x, y, scrollToDown: elementScrollToDown = 0 } = element;
        const parent = stepItemParent.get(parentId);
        refElement?.current.scrollTo({ x, y: (parent ? Math.floor(parent.y) + y : y) - elementScrollToDown, animated: true });
        setComponent(elementChildren);
        setStyle(elementStyle);
        setScrollToDown(elementScrollToDown);
      } else {
        setStep(1);
      }
    }
  }, [executeAnimations, isTutorialVisible, refElement, step, stepItemParent, stepItems]);

  const trackStep = useCallback(() => {
    trackUserEvent(
      TealiumEventType.TUTORIAL,
      {
        page_name: `${PageNames.TUTORIAL} > Screen ${step}`,
        event_name: TealiumEventType.TUTORIAL,
        uxObject: UxObject.BUTTON,
        event_type: TealiumEventType.TUTORIAL_NEXT
      },
      ForterActionType.TAP
    );
  }, [step, trackUserEvent]);

  const handleNextStep = useCallback(() => {
    if (step === stepItems.size) {
      setStep(1);
      if (onTutorialEnd) onTutorialEnd();
      return;
    }
    executeAnimations();
    setStep(prevStep => prevStep + 1);
    trackStep();
  }, [executeAnimations, step, stepItems.size, trackStep, onTutorialEnd]);

  /** @todo istanbul ignore next was added on [LEAP-3088] - due to is an animation's gesture and it is difficult to test */
  /* istanbul ignore next */
  const handlePreviousStep = useCallback(() => {
    if (step === 1) return;
    executeAnimations();
    trackStep();
    setStep(prevStep => prevStep - 1);
  }, [executeAnimations, step, trackStep]);

  const handleSkip = useCallback(() => {
    dispatch(actions.showTutorial(false));
    setStep(1);
    setComponent(undefined);
    refElement?.current?.scrollTo({ x: 0, y: 0, animated: true });
    if (onSkipCallback) onSkipCallback();
  }, [dispatch, refElement, onSkipCallback]);

  return (
    <>
      <GestureRecognizer onSwipeLeft={handleNextStep} onSwipeRight={handlePreviousStep}>
        <Modal {...getTestIdProps('modal')} animationType="fade" transparent visible={isTutorialVisible} statusBarTranslucent>
          <View style={styles.facade} />
          <Animated.View style={[style, styles.container, { opacity: fadeAnim, zIndex: zIndexAnim }]}>
            <View style={styles.facadeComponent} />
            <SafeAreaView style={[styles.banner, { marginTop: top }]}>
              <EnvBanner />
              <ConnectionBanner />
            </SafeAreaView>
            <View style={[styles.skip, { height: topHeight, marginBottom: scrollToDown }]}>
              <Button
                {...getTestIdProps('button-skip')}
                containerColor={COLOR.WHITE}
                textColor={COLOR.PRIMARY_BLUE}
                innerContainerStyle={styles.skipButton}
                onPress={handleSkip}
                style={styles.skipButtonBody}
              >
                Skip
              </Button>
              {stepItems.get(step)?.isHidden && <PointPill icon={ICON.SYW_CIRCLE} points={availablePoints} />}
            </View>
            {stepItems.get(step)?.isHidden || component}
          </Animated.View>
          <Animated.View style={[styles.footer, { transform: [{ translateY: footerAnim }] }]}>
            {isTutorialVisible && <StepItems step={step - 1} handleNextStep={handleNextStep} />}
            <View style={styles.stepsContainer}>
              {stepIndicator(step - 1, stepItems.size)}
              <Button
                {...getTestIdProps('button-next')}
                style={styles.button}
                innerContainerStyle={styles.buttonInner}
                textStyle={styles.buttonText}
                onPress={handleNextStep}
              >
                Next
                <Icon color={COLOR.WHITE} name={ICON.ARROW_RIGHT} size={FONT_SIZE.TINY} />
              </Button>
            </View>
          </Animated.View>
        </Modal>
      </GestureRecognizer>
      {children}
    </>
  );
};

export default memo(Tutorial);

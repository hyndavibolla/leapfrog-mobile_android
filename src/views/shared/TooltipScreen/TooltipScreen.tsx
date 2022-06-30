import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Source } from 'react-native-fast-image';
import { View as AnimatedView } from 'react-native-animatable';

import { actions as coreActions } from '_state_mgmt/core/actions';
import { COLOR, FONT_FAMILY, FONT_SIZE, ForterActionType, ICON, TealiumEventType } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { getPageNameByRoute } from '_utils/trackingUtils';
import { Icon } from '_commons/components/atoms/Icon';

import { ImageBackground } from '../ImageBackground';
import { Text } from '../Text';
import { Title, TitleType } from '../Title';
import { ProgressRing } from '../ProgressRing';
import { Button } from '../Button';
import { styles } from './styles';

export interface IStep {
  imageSrc: number | Source;
  title: string;
  subtitle: string;
  text: string;
  trackingRouteName?: string;
  trackingSuccess?: TealiumEventType;
  trackingCancel?: TealiumEventType;
}

export interface Props {
  onComplete: () => void;
  stepList: IStep[];
  step: number;
}

export const TooltipScreen = ({ stepList, onComplete, step }: Props) => {
  const { getTestIdProps } = useTestingHelper('tooltip-screen');
  const { deps, dispatch } = useContext(GlobalContext);
  const { trackView, trackUserEvent } = useEventTracker();
  const scrollRef = useRef<ScrollView>();
  const width = Math.floor(deps.nativeHelperService.dimensions.getWindowWidth());
  const [currentStep, setCurrentStep] = useState<number>(step);
  const isLastStep = currentStep >= stepList.length - 1;

  useEffect(() => {
    const trackingRouteName = stepList[currentStep]?.trackingRouteName;
    if (trackingRouteName) trackView(trackingRouteName);
    dispatch(coreActions.setLastRouteParams({ step: currentStep + 1 }));
  }, [currentStep, stepList, trackView, dispatch]);

  useEffect(() => {
    setCurrentStep(step);
    scrollRef.current?.scrollTo({ y: 0, x: step * width, animated: false });
  }, [step, width]);

  const trackSuccess = () =>
    trackUserEvent(stepList[currentStep]?.trackingSuccess, { page_name: getPageNameByRoute(stepList[currentStep]?.trackingRouteName) }, ForterActionType.TAP);

  const onNext = () => {
    scrollRef.current?.scrollTo({ y: 0, x: (currentStep + 1) * width, animated: true });
    trackSuccess();
    dispatch(coreActions.setLastRouteParams({ step: currentStep + 2 }));
  };
  const onCompletePress = () => {
    trackSuccess();
    onComplete();
  };

  const onCancel = () => {
    trackUserEvent(stepList[currentStep]?.trackingCancel, { page_name: getPageNameByRoute(stepList[currentStep]?.trackingRouteName) }, ForterActionType.TAP);
    onComplete();
  };

  return (
    <>
      <ScrollView
        ref={scrollRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: `${100 * stepList.length}%` }}
        scrollEventThrottle={200}
        onScroll={data => {
          setCurrentStep(Math.floor(data.nativeEvent.contentOffset.x / width));
        }}
        pagingEnabled={true}
        {...getTestIdProps('container')}
      >
        {stepList.map((stepToRender, index) => {
          return (
            <View key={index} style={[styles.container, { width }]} {...getTestIdProps(`step-${index}-${index === currentStep ? 'active' : 'inactive'}`)}>
              <ImageBackground source={stepToRender.imageSrc} containerStyle={{ width, height: 300 }}>
                <Button
                  style={styles.closeBtn}
                  innerContainerStyle={styles.closeBtnInnerContainer}
                  onPress={onCancel}
                  containerColor={COLOR.WHITE}
                  {...getTestIdProps('close-btn')}
                >
                  <View style={styles.closeIconContainer}>
                    <Icon name={ICON.CLOSE} color={COLOR.BLACK} size={FONT_SIZE.SMALL} />
                  </View>
                </Button>
              </ImageBackground>
              <ScrollView>
                <View style={styles.infoContainer}>
                  <Text font={FONT_FAMILY.BOLD} style={styles.subtitle}>
                    {String(stepToRender.subtitle).toUpperCase()}
                  </Text>
                  <Title font={FONT_FAMILY.HEAVY} style={styles.title} type={TitleType.HEADER}>
                    {stepToRender.title}
                  </Title>
                  <Text style={styles.text}>{stepToRender.text}</Text>
                </View>
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.progressContainer}>
        <ProgressRing
          progress={((currentStep + 1) / stepList.length) * 100}
          color={COLOR.PRIMARY_BLUE}
          strokeWidth={2}
          width={85 + 32} // half next button's width
          style={styles.progressRing}
        />
        <Button
          innerContainerStyle={styles.nextBtnInnerContainer}
          onPress={isLastStep ? onCompletePress : onNext}
          textColor={COLOR.WHITE}
          containerColor={COLOR.PRIMARY_BLUE}
          {...getTestIdProps('next-btn')}
        >
          {isLastStep ? (
            <AnimatedView animation="fadeIn">
              <Icon name={ICON.TICK} size={FONT_SIZE.PETITE} />
            </AnimatedView>
          ) : (
            <Icon name={ICON.ARROW_RIGHT} color={COLOR.WHITE} size={FONT_SIZE.HUGE} />
          )}
        </Button>
      </View>
    </>
  );
};

export default memo(TooltipScreen);

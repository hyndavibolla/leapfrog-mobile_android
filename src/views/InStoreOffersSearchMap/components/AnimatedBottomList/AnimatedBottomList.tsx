import React, { memo, ReactElement, useCallback, useMemo, useRef } from 'react';
import { Animated, View, Text, Dimensions, PanResponder } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

import { handlePanResponderEnd, handleShouldSetPanResponder } from '../../utils/panResponder';
import { InStoreOfferDetailFooter } from '_views/InStoreOfferDetail/InStoreOfferDetailFooter';
import { ICardLinkOffer } from '_models/cardLink';
import { getMissionPointsAwardedText } from '_utils/getMissionPointsAwardedText';
import { inStoreOfferIsActivated } from '_utils/inStoreOfferIsActivated';

const { height } = Dimensions.get('window');
const sectionCollapsed = height * 0.4;
const sectionWithFooterCollapsed = height * 0.5;
const sectionExpanded = height * 0.8;
const sectionWithFooterExpanded = height * 0.9;

export interface Props {
  selectedOffer?: ICardLinkOffer;
  resultNumber: number;
  hideFooter?: boolean;
  onActivateRequested: () => void;
  children: (string | number | ((index: number) => ReactElement))[] | (string | number | ReactElement);
}

const AnimatedBottomList = ({ selectedOffer, resultNumber, hideFooter, onActivateRequested, children }: Props) => {
  const { getTestIdProps } = useTestingHelper('animated-bottom-list');

  const showFooter: boolean = useMemo(() => selectedOffer && !hideFooter, [hideFooter, selectedOffer]);

  const translation = useRef(new Animated.Value(sectionWithFooterCollapsed)).current;

  /* istanbul ignore next */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: handleShouldSetPanResponder,
      onMoveShouldSetPanResponder: handleShouldSetPanResponder,
      onPanResponderRelease: (e, gestureState) => handlePanResponderEnd(gestureState, handleSwipeUp, handleSwipeDown),
      onPanResponderTerminate: (e, gestureState) => handlePanResponderEnd(gestureState, handleSwipeUp, handleSwipeDown)
    })
  ).current;

  /* istanbul ignore next */
  const handleSwipeUp = useCallback(() => {
    Animated.timing(translation, {
      toValue: showFooter ? sectionWithFooterExpanded : sectionExpanded,
      useNativeDriver: false
    }).start();
  }, [showFooter, translation]);

  /* istanbul ignore next */
  const handleSwipeDown = useCallback(() => {
    Animated.timing(translation, {
      toValue: showFooter ? sectionWithFooterCollapsed : sectionCollapsed,
      useNativeDriver: false
    }).start();
  }, [showFooter, translation]);

  const getNote: string = useMemo(() => {
    return resultNumber === 1 ? '1 result' : `${resultNumber} results`;
  }, [resultNumber]);

  const isActivated = selectedOffer && inStoreOfferIsActivated(selectedOffer);

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          height: translation
        }
      ]}
      {...getTestIdProps('section')}
    >
      <View style={styles.touchContainer} {...panResponder.panHandlers}>
        <View style={styles.handle} />
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Participating Locations</Text>
          {!!resultNumber && <Text style={styles.note}>{getNote}</Text>}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.offerContainer}>{children}</View>
      </View>
      {showFooter && (
        <InStoreOfferDetailFooter
          rewardText={getMissionPointsAwardedText(selectedOffer.pointsAwarded) ?? 'Local Offer'}
          isActive={isActivated}
          disabled={false}
          onActivateRequested={onActivateRequested}
        />
      )}
    </Animated.View>
  );
};

export default memo(AnimatedBottomList);

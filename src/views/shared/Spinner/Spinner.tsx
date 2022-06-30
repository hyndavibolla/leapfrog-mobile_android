import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

import { Text } from '_components/Text';

import { useTestingHelper } from '_utils/useTestingHelper';
import { useTimer } from '_utils/useTimer';

import BetaVersion from '../../../assets/spinner/betaVersion@3x.svg';
import { ENV } from '_constants/env';
import { FONT_FAMILY } from '_constants/styles';

import { styles } from './styles';

export interface Props {
  size?: number;
  initialTimer?: number;
}

const defaultSpinnerSize = 50;

function Spinner({ size = defaultSpinnerSize, initialTimer = 0 }: Props) {
  const { getTestIdProps } = useTestingHelper('spinner');
  const { timer } = useTimer(Math.max(ENV.SPINNER_MESSAGE_CHANGE_MS / 10, 50), true, initialTimer);
  const spinnerStyle = useMemo(() => ({ width: size, height: size } as any), [size]);
  const getWrappedText = text => (
    <Text font={FONT_FAMILY.BOLD} style={styles.text} {...getTestIdProps('text')}>
      {text}
    </Text>
  );

  const text = (() => {
    if (timer >= ENV.SPINNER_MESSAGE_CHANGE_MS * 4) return getWrappedText('This is taking longer than usual...');
    if (timer >= ENV.SPINNER_MESSAGE_CHANGE_MS * 3) return getWrappedText('Just a few more seconds...');
    if (timer >= ENV.SPINNER_MESSAGE_CHANGE_MS * 2)
      return (
        <>
          {getWrappedText('Preparing your custom')}
          {getWrappedText('experience...')}
        </>
      );
    if (timer >= ENV.SPINNER_MESSAGE_CHANGE_MS) return getWrappedText('Loading...');
    return null;
  })();

  const shouldShowText = !!(size >= defaultSpinnerSize && text);
  const shouldShowFooter = !!(size >= defaultSpinnerSize);

  return (
    <View style={[styles.container, { minHeight: size + (shouldShowText ? 20 : 0) }]} {...getTestIdProps('container')}>
      <View style={styles.centerContainer}>
        <LottieView
          style={[spinnerStyle, !shouldShowText && { position: 'absolute' }]}
          autoSize
          loop
          autoPlay
          source={require('../../../assets/spinner/spinner-loader.json')}
        />
        <View style={styles.textContainer}>{!shouldShowText ? null : text}</View>
      </View>
      {!shouldShowFooter ? null : (
        <View style={styles.footerContainer} {...getTestIdProps('footer')}>
          <BetaVersion />
          <Text font={FONT_FAMILY.MEDIUM} style={styles.textFooter}>
            Hello explorer! You’re one of the first to experience our SYW MAX App!
          </Text>
        </View>
      )}
    </View>
  );
}

export default memo(Spinner);

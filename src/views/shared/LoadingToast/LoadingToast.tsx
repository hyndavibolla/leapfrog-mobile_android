/* istanbul ignore file */

import React, { memo } from 'react';
import { View } from 'react-native';

import { styles } from './styles';
import { useTimer } from '../../../utils/useTimer';
import { ENV } from '../../../constants';
import { Text } from '../Text';
import { useTestingHelper } from '../../../utils/useTestingHelper';

export interface Props {
  initialTimer?: number;
}

export const LoadingToast = ({ initialTimer = 0 }: Props) => {
  const { getTestIdProps } = useTestingHelper('spinner');
  const { timer } = useTimer(Math.max(ENV.SPINNER_MESSAGE_CHANGE_MS / 10, 50), true, initialTimer);

  const content = (() => {
    if (timer >= ENV.SPINNER_MESSAGE_CHANGE_MS * 2) {
      return {
        title: '🚀🌖 This is taking longer than usual…',
        text: "You're the first experiencing our SYW MAX App!"
      };
    }
    if (timer >= ENV.SPINNER_MESSAGE_CHANGE_MS)
      return {
        title: '🤔💬 Just a few more seconds…',
        text: "You're the first experiencing our SYW MAX App!"
      };
    return null;
  })();

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      {!content?.title ? null : (
        <View style={styles.toast}>
          <Text style={styles.title}>{content?.title}</Text>
          <Text style={styles.text}>{content?.text}</Text>
        </View>
      )}
    </View>
  );
};

export default memo(LoadingToast);

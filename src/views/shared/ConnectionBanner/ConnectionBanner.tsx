import React, { memo, useContext } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { COLOR, FONT_FAMILY, ICON } from '_constants';
import { styles } from './styles';
import { Icon } from '_commons/components/atoms/Icon';

import { Text } from '../Text';

export interface Props {
  style?: StyleProp<ViewStyle>;
  title?: string;
}

export const ConnectionBanner = ({ style, title = "You don't have an internet connection" }: Props) => {
  const { getTestIdProps } = useTestingHelper('connection-banner');

  const { state } = useContext(GlobalContext);
  return state.core.isConnected ? null : (
    <View style={[styles.container, style]} {...getTestIdProps('container')}>
      <Icon name={ICON.NO_CONNECTION} color={COLOR.WHITE} style={styles.icon} />
      <Text font={FONT_FAMILY.BOLD} style={styles.title}>
        {title}
      </Text>
    </View>
  );
};

export default memo(ConnectionBanner);

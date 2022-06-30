import React, { memo, ReactElement } from 'react';
import { View } from 'react-native';

import { Text } from '../../../shared/Text';
import { styles } from './styles';
import { Divider } from '../../../shared/Divider';
import { FONT_FAMILY } from '_constants';
import { DateLike } from '_models/general';

export interface Props {
  title: string;
  value: string | DateLike;
  icon: ReactElement;
  testIdProps?: object;
}

export const ActivityDetailRow = ({ title, value, icon, testIdProps }: Props) => {
  return (
    <View {...testIdProps}>
      <Divider containerStyle={styles.dividerContainer} />
      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>{icon}</View>
        <View>
          <Text font={FONT_FAMILY.BOLD} style={styles.infoTitle}>
            {title.toUpperCase()}
          </Text>
          <Text style={styles.infoText}>{value}</Text>
        </View>
      </View>
    </View>
  );
};

export default memo(ActivityDetailRow);

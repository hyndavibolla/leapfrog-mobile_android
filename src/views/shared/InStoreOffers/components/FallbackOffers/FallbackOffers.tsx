import React, { memo, ReactElement } from 'react';
import { ViewStyle } from 'react-native';
import { View, Text, StyleProp } from 'react-native';

import { useTestingHelper } from '../../../../../utils/useTestingHelper';

import { styles } from './styles';

export interface Props {
  icon: ReactElement;
  description: string;
  note?: string;
  style?: StyleProp<ViewStyle>;
}

const FallbackOffers = ({ icon, description, note, style }: Props) => {
  const { getTestIdProps } = useTestingHelper('fallback-offers');

  return (
    <View style={[styles.container, style]} {...getTestIdProps('container')}>
      {icon}
      <View style={styles.dataContainer}>
        <Text style={styles.description}>{description}</Text>
        {note && <Text style={styles.note}>{note}</Text>}
      </View>
    </View>
  );
};

export default memo(FallbackOffers);

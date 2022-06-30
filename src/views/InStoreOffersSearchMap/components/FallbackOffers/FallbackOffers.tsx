import React, { memo, ReactElement } from 'react';
import { View, Text, StyleProp, TextStyle } from 'react-native';

import { useTestingHelper } from '../../../../utils/useTestingHelper';

import { styles } from './styles';

export interface Props {
  icon: ReactElement;
  description: string;
  note: string;
  descriptionStyle?: StyleProp<TextStyle>;
  noteStyle?: StyleProp<TextStyle>;
}

const FallbackOffers = ({ icon, description, note, descriptionStyle, noteStyle }: Props) => {
  const { getTestIdProps } = useTestingHelper('fallback-offers-map');

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      {icon}
      <Text style={[styles.description, descriptionStyle]}>{description}</Text>
      <Text style={[styles.note, noteStyle]}>{note}</Text>
    </View>
  );
};

export default memo(FallbackOffers);

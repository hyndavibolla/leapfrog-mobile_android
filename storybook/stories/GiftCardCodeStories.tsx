import React from 'react';
import { View } from 'react-native';
import { GiftCardCode } from '../../src/views/shared/GiftCardCode';

import { Text } from '../../src/views/shared/Text';
import { styles } from '../styles';

export const GiftCardCodeStory = () => (
  <>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Gift Card Code</Text>
      <Text style={styles.text}>GiftCardCode component that it is used to generate diffents kind of codes.</Text>
      <GiftCardCode barcodeKind="" barcodeValue="1234567890" />
    </View>
  </>
);

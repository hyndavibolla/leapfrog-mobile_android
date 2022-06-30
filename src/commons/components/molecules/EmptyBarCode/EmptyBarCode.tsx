import React from 'react';
import { Text, View } from 'react-native';

import { Icon } from '_commons/components/atoms/Icon';
import { ICON } from '_constants/icons';
import { COLOR, FONT_SIZE } from '_constants/styles';
import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

const EmptyBarCode = () => {
  const { getTestIdProps } = useTestingHelper('empty-bar-code');
  return (
    <View style={styles.container} {...getTestIdProps('body')}>
      <Icon name={ICON.BAR_CODE} size={FONT_SIZE.XL} color={COLOR.BLACK} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>This Gift Card doesn’t have a barcode. Please enter your card number to complete your purchase.</Text>
      </View>
    </View>
  );
};

export default EmptyBarCode;

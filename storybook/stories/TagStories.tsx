import React from 'react';
import { View } from 'react-native';

import { Tag } from '_commons/components/atoms/Tag';
import { Text } from '_components/Text';
import { styles } from '../styles';

export default () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Tag</Text>
    <View style={styles.componentContainer}>
      <Tag>Online Offer</Tag>
    </View>
  </View>
);

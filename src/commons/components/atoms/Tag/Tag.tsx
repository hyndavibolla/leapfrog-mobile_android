import React, { memo } from 'react';
import { View } from 'react-native';

import { Text } from '_components/Text';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props {
  children: string;
}

const Tag = ({ children }: Props) => {
  const { getTestIdProps } = useTestingHelper('tag');
  return (
    <View style={styles.container}>
      <Text style={styles.text} {...getTestIdProps('title')}>
        {children}
      </Text>
    </View>
  );
};

export default memo(Tag);

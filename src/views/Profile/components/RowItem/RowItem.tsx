import React, { memo, ReactElement } from 'react';
import { TouchableHighlight, Text, View } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { Card } from '_components/Card/Card';

import { styles } from './styles';

export interface Props {
  name: string;
  onPress: () => void;
  testIdName: string;
  icon: ReactElement;
  value?: string;
}

export const RowItem = memo(({ name, onPress, testIdName, icon, value }: Props) => {
  const { getTestIdProps } = useTestingHelper('profile-row-item');
  return (
    <TouchableHighlight onPress={onPress} underlayColor="transparent" activeOpacity={1} {...getTestIdProps(testIdName)}>
      <Card style={styles.linksCard}>
        <Text style={styles.linksText}>{name}</Text>
        <View style={styles.rightContent}>
          {value ? (
            <Text style={styles.valueText} {...getTestIdProps(`${testIdName}-value`)}>
              {value}
            </Text>
          ) : null}
          <View style={styles.iconContainer}>{icon}</View>
        </View>
      </Card>
    </TouchableHighlight>
  );
});

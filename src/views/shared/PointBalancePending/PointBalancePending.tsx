import React, { memo } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import Image from 'react-native-fast-image';

import { Icon } from '_commons/components/atoms/Icon';
import { COLOR, FONT_SIZE, ICON } from '_constants';
import { Text } from '_components/Text';
import { Card } from '_components/Card';
import { styles } from './styles';
import { useTestingHelper } from '_utils/useTestingHelper';

export interface Props {
  onPress?: () => void;
}

export const PointBalancePending = ({ onPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('point-balance-pending');

  return (
    <View {...getTestIdProps('container')}>
      <Card style={styles.container}>
        <Image source={require('../../../assets/shared/pendingClock.png')} style={styles.clock as any} resizeMode="contain" />
        <Text style={styles.text}>
          <Text style={styles.boldText}>Time's up.</Text> Your Level will be recalculated soon. Stay tuned!
        </Text>
        {onPress ? (
          <TouchableWithoutFeedback onPress={onPress}>
            <View>
              <Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.REGULAR} color={COLOR.DARK_GRAY} />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </Card>
    </View>
  );
};

export default memo(PointBalancePending);

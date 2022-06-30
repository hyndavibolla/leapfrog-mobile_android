import React, { memo, PropsWithChildren } from 'react';
import { View, TouchableHighlight, GestureResponderEvent } from 'react-native';

import { Card } from '_components/Card';
import { Icon } from '_commons/components/atoms/Icon';
import { COLOR, FONT_SIZE, ICON } from '_constants';
import YellowStar from '_assets/shared/yellowStar.svg';

import { styles } from './styles';

export interface Props {
  onPress?: (event: GestureResponderEvent) => void;
  boosted?: boolean;
}

const LevelBenefit = ({ children, boosted = true, onPress }: PropsWithChildren<Props>) => {
  return (
    <TouchableHighlight style={styles.first} onPress={onPress} testID="level-benefits-btn" underlayColor="transparent" activeOpacity={1}>
      <Card style={styles.container}>
        <View style={styles.body}>
          <View style={styles.bodyItem}>
            {boosted ? <YellowStar /> : <Icon name={ICON.TICK_CIRCLE} size={FONT_SIZE.REGULAR} color={COLOR.GREEN} />}
            <View style={styles.text}>{children}</View>
          </View>
          {onPress ? <Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.REGULAR} color={COLOR.DARK_GRAY} /> : null}
        </View>
      </Card>
    </TouchableHighlight>
  );
};

export default memo(LevelBenefit);

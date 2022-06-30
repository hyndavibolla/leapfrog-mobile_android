import React, { memo } from 'react';
import { View } from 'react-native';

import { ICON, COLOR, FONT_SIZE } from '_constants';

import { Icon } from '_commons/components/atoms/Icon';
import { useTestingHelper } from '_utils/useTestingHelper';

import ErrorBoundary from '_components/ErrorBoundary';
import { Pill } from '_components/Pill';
import { RouletteNumber } from '_components/RouletteNumber';

import { styles } from './styles';

export interface Props {
  points: number;
  icon: ICON;
  size?: FONT_SIZE;
  color?: COLOR;
}

const PointPill = ({ points, icon, size = FONT_SIZE.BIG, color = COLOR.WHITE }: Props) => {
  const { getTestIdProps } = useTestingHelper('point-pill');

  return (
    <View style={styles.pointsContainer} {...getTestIdProps('body')}>
      <Pill
        {...getTestIdProps('points')}
        style={styles.pillContainer}
        icon={
          <View {...getTestIdProps('icon')} style={styles.iconBackground}>
            <Icon name={icon} size={size} color={color} />
          </View>
        }
      >
        <ErrorBoundary>
          <RouletteNumber valueStyle={styles.points} hideNumber={false}>
            {points}
          </RouletteNumber>
        </ErrorBoundary>
      </Pill>
    </View>
  );
};

export default memo(PointPill);

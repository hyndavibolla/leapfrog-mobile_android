import React, { memo } from 'react';
import { TouchableHighlight, View } from 'react-native';

import { BrandLogo } from '../BrandLogo';
import { Card } from '../Card';
import { Text } from '../Text';
import { Pill } from '../Pill';

import { IMission } from '../../../models/mission';

import { getMissionPointsAwardedText } from '../../../utils/getMissionPointsAwardedText';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { FONT_FAMILY } from '../../../constants';

import { styles } from './styles';

export enum Orientation {
  HORIZONTAL,
  VERTICAL
}

export interface Props {
  mission: IMission;
  orientation?: Orientation;
  onPress?: () => void;
}

export const SmallMissionCard = ({ onPress, mission, orientation = Orientation.HORIZONTAL }: Props) => {
  const { brandLogo, brandName, pointsAwarded } = mission;

  const { getTestIdProps } = useTestingHelper('small-mission-card');

  return (
    <TouchableHighlight underlayColor="transparent" onPress={onPress} {...getTestIdProps('container')}>
      <Card style={[styles.container, orientation === Orientation.VERTICAL && styles.verticalContainer]}>
        <BrandLogo image={brandLogo} category={pointsAwarded?.conditions[0]?.category} />
        <View style={[styles.missionDetails, orientation === Orientation.HORIZONTAL && styles.horizontalMissionDetails]}>
          {orientation !== Orientation.HORIZONTAL ? null : (
            <Text font={FONT_FAMILY.BOLD} numberOfLines={1} ellipsizeMode="tail" style={styles.brandName} {...getTestIdProps('brand-name')}>
              {brandName}
            </Text>
          )}
          <View style={[styles.pointContainer, orientation === Orientation.VERTICAL && styles.verticalPointContainer]}>
            <View
              style={[
                orientation === Orientation.HORIZONTAL && styles.horizontalPillContainer,
                orientation === Orientation.VERTICAL && styles.verticalPillContainer
              ]}
            >
              <Pill textFallback={'Mission'}>{getMissionPointsAwardedText(mission.pointsAwarded)}</Pill>
            </View>
          </View>
        </View>
      </Card>
    </TouchableHighlight>
  );
};

export default memo(SmallMissionCard);

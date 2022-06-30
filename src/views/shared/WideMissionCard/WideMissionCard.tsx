import React, { memo } from 'react';
import { View, TouchableHighlight } from 'react-native';

import { Text } from '_components/Text';
import { Card } from '_components/Card';
import { Pill } from '_components/Pill';
import { BrandLogo } from '_components/BrandLogo';
import { MissionModel } from '_models';
import { getMissionPointsAwardedText } from '_utils/getMissionPointsAwardedText';
import { useTestingHelper } from '_utils/useTestingHelper';
import { getBrandName } from '_utils/mapBrand';
import { FONT_FAMILY } from '_constants';

import { styles } from './styles';

export interface Props {
  mission: MissionModel.IMission;
  hasStreakTag?: boolean;
  onPress?: () => void;
}

export const WideMissionCard = ({ onPress, mission, hasStreakTag }: Props) => {
  const { getTestIdProps } = useTestingHelper('wide-mission-card');

  return (
    <TouchableHighlight underlayColor="transparent" onPress={onPress} {...getTestIdProps('container')}>
      <Card style={styles.cardContainer}>
        <BrandLogo image={mission?.brandLogo} category={mission?.pointsAwarded?.conditions[0]?.category} style={styles.logoImage} />
        <View style={styles.infoSection}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title} font={FONT_FAMILY.BOLD} {...getTestIdProps('mission-name')}>
            {getBrandName(mission.brandName)}
          </Text>
          <Pill textFallback={'Mission'}>{getMissionPointsAwardedText(mission.pointsAwarded)}</Pill>
        </View>
        {hasStreakTag && (
          <View>
            <Text {...getTestIdProps('streak-tag')} style={styles.missionText}>
              🔥 Mission
            </Text>
          </View>
        )}
      </Card>
    </TouchableHighlight>
  );
};

export default memo(WideMissionCard);

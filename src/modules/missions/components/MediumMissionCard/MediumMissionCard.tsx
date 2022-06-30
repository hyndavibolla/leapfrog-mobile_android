import React, { memo } from 'react';
import { View, TouchableHighlight } from 'react-native';

import { FONT_FAMILY } from '_constants';
import { BrandLogo } from '_components/BrandLogo';
import { Card } from '_components/Card';
import { ImageBackgroundWithFallback } from '_components/ImageBackgroundWithFallback';
import { Pill } from '_components/Pill';
import { Text } from '_components/Text';
import { MissionModel } from '_models';
import { getMissionPointsAwardedText } from '_utils/getMissionPointsAwardedText';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props {
  mission: MissionModel.IMission;
  hasStreakTag?: boolean;
  onPress?: () => void;
}

export const MediumMissionCard = ({ onPress, mission, hasStreakTag }: Props) => {
  const { getTestIdProps } = useTestingHelper('medium-mission-card');
  return (
    <TouchableHighlight underlayColor="transparent" onPress={onPress} {...getTestIdProps('container')}>
      <Card style={styles.cardContainer}>
        <ImageBackgroundWithFallback
          source={{ uri: mission.image }}
          containerStyle={styles.backgroundContainer}
          fallbackSource={require('_assets/shared/missionMediumCardBg.png')}
        />
        <View style={styles.logoContainer}>
          <BrandLogo image={mission?.brandLogo} category={mission?.pointsAwarded?.conditions[0]?.category} style={styles.logoImage} />
        </View>
        <View style={styles.infoContainer}>
          <Text font={FONT_FAMILY.BOLD} numberOfLines={1} ellipsizeMode="tail" style={styles.title} {...getTestIdProps('mission-name')}>
            {mission.brandName}
          </Text>
          <Pill style={styles.pill} textFallback={'Mission'}>
            {getMissionPointsAwardedText(mission.pointsAwarded)}
          </Pill>
        </View>
        {hasStreakTag && (
          <View style={styles.missionOfferContainer} {...getTestIdProps('streak-tag')}>
            <Text style={styles.missionOfferText}>🔥 Mission offer</Text>
          </View>
        )}
      </Card>
    </TouchableHighlight>
  );
};

export default memo(MediumMissionCard);

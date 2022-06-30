import React, { memo, useMemo } from 'react';
import { View, TouchableHighlight } from 'react-native';
import { Text } from '../Text';

import { styles } from './styles';
import { Card } from '../Card';
import { Pill } from '../Pill';
import { MissionModel } from '../../../models';
import { BrandLogo } from '../BrandLogo';
import { getMissionPointsAwardedText } from '../../../utils/getMissionPointsAwardedText';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { FONT_FAMILY } from '../../../constants';
import { ImageWithFallback } from '../ImageWithFallback';
import { getBrandName } from '../../../utils/mapBrand';

export interface Props {
  mission: MissionModel.IMission;
  fullSize?: boolean;
  onPress?: () => void;
}

export const LargeMissionCard = ({ onPress, mission, fullSize }: Props) => {
  const { getTestIdProps } = useTestingHelper('large-mission-card');
  const source = useMemo(() => mission.image && { uri: mission.image }, [mission.image]);

  return (
    <TouchableHighlight underlayColor="transparent" onPress={onPress} {...getTestIdProps('container')}>
      <View style={styles.shadowContainer}>
        <Card style={styles.cardContainer}>
          <View style={[styles.containerGeneral, fullSize && styles.fullSize]}>
            <View style={styles.mainImageContainer}>
              <ImageWithFallback style={styles.mainImage as any} source={source} fallbackSource={require('../../../assets/shared/imageBackground.png')} />
            </View>
            <View style={styles.content}>
              <BrandLogo image={mission?.brandLogo} category={mission?.pointsAwarded?.conditions[0]?.category} style={styles.logoImage} />
              <View style={styles.infoSection}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subtitle} font={FONT_FAMILY.BOLD} {...getTestIdProps('brand-name')}>
                  {getBrandName(mission.brandName)}
                </Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title} font={FONT_FAMILY.BOLD} {...getTestIdProps('mission-name')}>
                  {mission.name}
                </Text>
                <Pill textFallback={'Mission'}>{getMissionPointsAwardedText(mission.pointsAwarded)}</Pill>
              </View>
            </View>
          </View>
        </Card>
      </View>
    </TouchableHighlight>
  );
};

export default memo(LargeMissionCard);

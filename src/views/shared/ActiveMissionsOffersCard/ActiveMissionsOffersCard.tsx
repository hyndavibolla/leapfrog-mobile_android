import React, { memo, useCallback } from 'react';
import { StyleProp, Text, TouchableHighlight, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTestingHelper } from '_utils/useTestingHelper';

import { BrandLogo } from '_components/BrandLogo';
import { Pill } from '_components/Pill';

import { useEventTracker } from '_state_mgmt/core/hooks';
import { IMission } from '_models/mission';

import { getRewardType, getRewardValue } from '_utils/getMissionPointsAwardedText';
import { ROUTES } from '_constants/routes';
import { ForterActionType, PageNames, TealiumEventType, UxObject } from '_constants/eventTracking';

import { styles } from './styles';

export interface Props {
  mission: IMission;
  streakIndicator: boolean;
  style?: StyleProp<ViewStyle>;
}

function ActiveMissionsOffersCard({ mission, streakIndicator, style }: Props) {
  const { navigate } = useNavigation();
  const { getTestIdProps } = useTestingHelper('active-missions-offers-card');
  const { trackUserEvent } = useEventTracker();

  const { brandLogo, pointsAwarded } = mission;

  const handlePressCard = useCallback(
    ({ brandName, offerId, brandRequestorId, brandCategories }: IMission) => {
      trackUserEvent(
        TealiumEventType.SELECT_MISSION,
        {
          page_name: PageNames.MAIN.EARN,
          event_type: brandName,
          event_detail: offerId,
          uxObject: UxObject.LIST,
          brand_name: brandName,
          brand_id: brandRequestorId,
          brand_category: brandCategories[0]
        },
        ForterActionType.TAP
      );
      navigate(ROUTES.MISSION_DETAIL, { brandRequestorId: brandRequestorId, isAvailableStreakIndicator: streakIndicator });
    },
    [navigate, streakIndicator, trackUserEvent]
  );

  return (
    <TouchableHighlight {...getTestIdProps('container')} underlayColor="transparent" style={[styles.card, style]} onPress={() => handlePressCard(mission)}>
      <>
        <BrandLogo image={brandLogo} category={pointsAwarded?.conditions[0]?.category} style={styles.logo} />
        <Pill textFallback={'Mission'} size="S">
          {getRewardValue(pointsAwarded)}
        </Pill>
        <Text style={styles.typePill}>{getRewardType(pointsAwarded)}</Text>
      </>
    </TouchableHighlight>
  );
}

export default memo(ActiveMissionsOffersCard);

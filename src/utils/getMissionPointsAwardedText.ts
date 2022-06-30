import { IAwardCondition, IPointsAwarded } from '_models/mission';
import { MissionModel } from '_models';

import { formatNumber } from '_utils/formatNumber';

export const getMissionPointsAwardedText = (pointsAwarded: IPointsAwarded | IAwardCondition): string => {
  if (!pointsAwarded?.rewardType || !pointsAwarded?.rewardValue) return null;
  const { rewardType, rewardValue } = pointsAwarded;
  switch (rewardType) {
    case MissionModel.RedemptionType.POINT_PER_DOLLAR:
      return `${formatNumber(rewardValue)} per $1`;
    case MissionModel.RedemptionType.PERCENT_OFF:
      return `${formatNumber(rewardValue)}% back in points`;
    case MissionModel.RedemptionType.FIXED_POINTS:
    default:
      return `${formatNumber(rewardValue)}`;
  }
};

export const getRewardValue = (pointsAwarded: IPointsAwarded | IAwardCondition): string => {
  if (!pointsAwarded?.rewardType || !pointsAwarded?.rewardValue) {
    return 'Missions';
  }
  const { rewardType, rewardValue } = pointsAwarded;
  switch (rewardType) {
    case MissionModel.RedemptionType.PERCENT_OFF:
      return `${formatNumber(rewardValue)}%`;
    default:
      return `${formatNumber(rewardValue)}`;
  }
};

export const getRewardType = (pointsAwarded: IPointsAwarded | IAwardCondition): string => {
  switch (pointsAwarded?.rewardType) {
    case MissionModel.RedemptionType.POINT_PER_DOLLAR:
      return 'per $1';
    case MissionModel.RedemptionType.PERCENT_OFF:
      return 'back in points';
    default:
      return '';
  }
};

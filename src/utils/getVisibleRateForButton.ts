import { MissionModel } from '../models';

export const getVisibleRateForButton = (pointsAwarded: MissionModel.IPointsAwarded | MissionModel.IAwardCondition, rate: number): number => {
  const { rewardType, rewardValue } = pointsAwarded;
  switch (rewardType) {
    case MissionModel.RedemptionType.POINT_PER_DOLLAR:
      return rate ? rewardValue / (rate * 100) : 0;
    case MissionModel.RedemptionType.PERCENT_OFF:
      return rewardValue;
    case MissionModel.RedemptionType.FIXED_POINTS:
    default:
      return rate ? rewardValue / rate / 100 : 0;
  }
};

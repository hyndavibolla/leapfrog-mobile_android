import { MissionModel } from '../models';
import { IAwardCondition } from '../models/mission';
import { getVisibleRateForButton } from './getVisibleRateForButton';

export const getSortedConditions = (conditions: IAwardCondition[], pointsPerCent: number): IAwardCondition[] => {
  const filteredConditions = conditions?.filter(condition => condition.rewardType && condition.rewardValue > 0 && condition.category !== null);
  if (filteredConditions?.length === 1) return [];
  filteredConditions?.sort((conditionA, conditionB) => {
    /** Sort by rewardType, FIXED_POINTS first, then POINTS_PER_DOLLAR and PERCENT_OFF */
    if (conditionA.rewardType === MissionModel.RedemptionType.FIXED_POINTS && conditionB.rewardType !== MissionModel.RedemptionType.FIXED_POINTS) {
      return -1;
    }

    if (conditionB.rewardType === MissionModel.RedemptionType.FIXED_POINTS && conditionA.rewardType !== MissionModel.RedemptionType.FIXED_POINTS) {
      return 1;
    }

    /** Sort by rewardValue. This value has to be normalized since PERCENT_OFF conditions need to be converted to POINTS_PER_DOLLAR */
    const visibleRateA = getVisibleRateForButton(conditionA, pointsPerCent);
    const visibleRateB = getVisibleRateForButton(conditionB, pointsPerCent);
    if (visibleRateA !== visibleRateB) {
      return visibleRateB - visibleRateA;
    }

    /** If rewardValue is the same sort alphabetically, if category is empty leave it last */
    if (!conditionA.category?.trim()) return 1;
    if (!conditionB.category?.trim()) return -1;

    return conditionA.category?.trim() > conditionB.category?.trim() ? 1 : -1;
  });

  return filteredConditions;
};

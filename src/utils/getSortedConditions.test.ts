import { MissionModel } from '../models';
import { getSortedConditions } from './getSortedConditions';

describe('getSortedConditions', () => {
  it('should return an empty array if only one condition is present', () => {
    const conditions = [{ category: 'category-a', rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 1000 }];
    expect(getSortedConditions(conditions, 10)).toStrictEqual([]);
  });

  it('should sort conditions by rewardType, rewardValue and category', () => {
    const conditions = [
      { category: 'category-a', rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 1000 },
      { category: '', rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR, rewardValue: 10 },
      { category: '', rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR, rewardValue: 10 },
      { category: 'category-b', rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 10 },
      { category: null, rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR, rewardValue: 10 },
      { category: 'category-c', rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR, rewardValue: 10 },
      { category: 'category-d', rewardType: MissionModel.RedemptionType.PERCENT_OFF, rewardValue: 10 },
      { category: 'category', rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 1000 }
    ];
    expect(getSortedConditions(conditions, 10)).toStrictEqual([
      { category: 'category', rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 1000 },
      { category: 'category-a', rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 1000 },
      { category: 'category-b', rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 10 },
      { category: 'category-d', rewardType: MissionModel.RedemptionType.PERCENT_OFF, rewardValue: 10 },
      { category: 'category-c', rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR, rewardValue: 10 },
      { category: '', rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR, rewardValue: 10 },
      { category: '', rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR, rewardValue: 10 }
    ]);
  });
});

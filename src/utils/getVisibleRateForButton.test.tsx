import { getVisibleRateForButton } from './getVisibleRateForButton';
import { MissionModel } from '../models';

describe('getMissionPointsAwardedValue', () => {
  it(`should get a calculated value for ${MissionModel.RedemptionType.FIXED_POINTS}`, () => {
    expect(getVisibleRateForButton({ rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 100, category: 'category-a' }, 1000)).toEqual(0.001);
  });

  it(`should get a zero value for ${MissionModel.RedemptionType.FIXED_POINTS} with zero rate`, () => {
    expect(getVisibleRateForButton({ rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 100, category: 'category-a' }, 0)).toEqual(0);
  });

  it(`should get a calculated value for ${MissionModel.RedemptionType.PERCENT_OFF}`, () => {
    expect(getVisibleRateForButton({ rewardType: MissionModel.RedemptionType.PERCENT_OFF, rewardValue: 50, category: 'category-a' }, 1000)).toEqual(50);
  });

  it(`should get a calculated value for ${MissionModel.RedemptionType.POINT_PER_DOLLAR}`, () => {
    expect(getVisibleRateForButton({ rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR, rewardValue: 50, category: 'category-a' }, 1000)).toEqual(
      0.0005
    );
  });

  it(`should get zero value for ${MissionModel.RedemptionType.POINT_PER_DOLLAR} with zero rate`, () => {
    expect(getVisibleRateForButton({ rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR, rewardValue: 50, category: 'category-a' }, 0)).toEqual(0);
  });

  it('should get a default calculated value', () => {
    expect(getVisibleRateForButton({ rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 200, category: 'category-a' }, 1000)).toEqual(0.002);
  });
});

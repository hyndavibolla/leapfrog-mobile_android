import { MissionModel } from '_models';
import { getMissionPointsAwardedText, getRewardType, getRewardValue } from './getMissionPointsAwardedText';

describe('getMissionPointsAwardedText', () => {
  it(`should get a text for ${MissionModel.RedemptionType.FIXED_POINTS}`, () => {
    expect(getMissionPointsAwardedText({ rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 5, conditions: [] })).toEqual('5');
  });
  it(`should get a text for ${MissionModel.RedemptionType.PERCENT_OFF}`, () => {
    expect(getMissionPointsAwardedText({ rewardType: MissionModel.RedemptionType.PERCENT_OFF, rewardValue: 5, conditions: [] })).toEqual('5% back in points');
  });
  it(`should get a text for ${MissionModel.RedemptionType.POINT_PER_DOLLAR}`, () => {
    expect(getMissionPointsAwardedText({ rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR, rewardValue: 5, conditions: [] })).toEqual('5 per $1');
  });
  it('should get a default text', () => {
    expect(getMissionPointsAwardedText({ rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 5, conditions: [] })).toEqual('5');
  });
  it(`should get the value empty when rewardType or rewardValue is null`, () => {
    expect(getRewardValue({ rewardType: null, rewardValue: null, conditions: [] })).toEqual('Missions');
  });
  it(`should get the value for ${MissionModel.RedemptionType.PERCENT_OFF}`, () => {
    expect(getRewardValue({ rewardType: MissionModel.RedemptionType.PERCENT_OFF, rewardValue: 5, conditions: [] })).toEqual('5%');
  });
  it(`should get the value for ${MissionModel.RedemptionType.FIXED_POINTS}`, () => {
    expect(getRewardValue({ rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 5, conditions: [] })).toEqual('5');
  });
  it(`should get the type for ${MissionModel.RedemptionType.POINT_PER_DOLLAR}`, () => {
    expect(getRewardType({ rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR, rewardValue: 5, conditions: [] })).toEqual('per $1');
  });
  it(`should get the type for ${MissionModel.RedemptionType.POINT_PER_DOLLAR}`, () => {
    expect(getRewardType({ rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR, rewardValue: 5, conditions: [] })).toEqual('per $1');
  });
  it(`should get the type for ${MissionModel.RedemptionType.PERCENT_OFF}`, () => {
    expect(getRewardType({ rewardType: MissionModel.RedemptionType.PERCENT_OFF, rewardValue: 5, conditions: [] })).toEqual('back in points');
  });
  it('should get a default type', () => {
    expect(getRewardType({ rewardType: MissionModel.RedemptionType.FIXED_POINTS, rewardValue: 5, conditions: [] })).toEqual('');
  });
});

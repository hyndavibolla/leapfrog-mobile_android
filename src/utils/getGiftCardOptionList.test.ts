import { RewardModel } from '../models';
import { getSlideBrand_1 } from '../test-utils/entities';
import { getGiftCardOptionList } from './getGiftCardOptionList';

describe('getGiftCardOptionList', () => {
  it('should return an option list for variable load supported brands', () => {
    const brand: RewardModel.IBrand = {
      ...getSlideBrand_1(),
      cardValueConfig: { ...getSlideBrand_1().cardValueConfig, minValue: 0, maxValue: 20000, variableLoadSupported: true }
    };
    expect(getGiftCardOptionList(brand, 5)).toEqual([5, 10, 15, 25, 50, 75, 100, 125, 150, 175, 200]);
  });

  it('should return an option list for NON variable load supported brands', () => {
    const brand: RewardModel.IBrand = {
      ...getSlideBrand_1(),
      cardValueConfig: {
        ...getSlideBrand_1().cardValueConfig,
        minValue: 0,
        maxValue: 100000,
        variableLoadSupported: false,
        denominations: [1000, 5000, 10000]
      }
    };
    expect(getGiftCardOptionList(brand, 5)).toEqual([10, 50, 100]);
  });

  it('should NOT return 0 values on lists', () => {
    const brand: RewardModel.IBrand = {
      ...getSlideBrand_1(),
      cardValueConfig: { ...getSlideBrand_1().cardValueConfig, minValue: 0, maxValue: 0.1, variableLoadSupported: true }
    };
    expect(getGiftCardOptionList(brand, 5)).toEqual([]);
  });

  it('should use the ENV list length as default', () => {
    const brand: RewardModel.IBrand = {
      ...getSlideBrand_1(),
      cardValueConfig: { ...getSlideBrand_1().cardValueConfig, minValue: 500, maxValue: 10000, variableLoadSupported: true }
    };
    expect(getGiftCardOptionList(brand)).toEqual([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]);
  });

  it('should NOT return values on non variable support with no denominations', () => {
    const brand: RewardModel.IBrand = {
      ...getSlideBrand_1(),
      cardValueConfig: { ...getSlideBrand_1().cardValueConfig, minValue: 0, maxValue: 10, variableLoadSupported: false, denominations: undefined }
    };
    expect(getGiftCardOptionList(brand, 5)).toEqual([]);
  });

  it('should NOT return values on invalid min/max settings', () => {
    const brand: RewardModel.IBrand = {
      ...getSlideBrand_1(),
      cardValueConfig: { ...getSlideBrand_1().cardValueConfig, maxValue: 0, minValue: 9999, variableLoadSupported: false, denominations: [200, 500] }
    };
    expect(getGiftCardOptionList(brand, 5)).toEqual([]);
  });
});

import { getDecimals, getNumberListFromRange } from './getNumberListFromRange';

describe('getNumberListFromRange', () => {
  it("should get a number list that doesn't reach the max if it's not needed", () => {
    expect(getNumberListFromRange({ minimum: 5, maximum: 50, maxOptionCount: 50, multiple: 5 })).toEqual([5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
  });

  it("should get a number list that increments it's multiplier by sections when it needs to reduce the option amount to be below the limit", () => {
    expect(getNumberListFromRange({ minimum: 5, maximum: 50, maxOptionCount: 5, multiple: 5 })).toEqual([5, 10, 20, 40, 50]);
  });

  it("should get a number list with max and min that aren't multipliers", () => {
    expect(getNumberListFromRange({ minimum: 4, maximum: 51, maxOptionCount: 5, multiple: 5 })).toEqual([4, 5, 20, 40, 51]);
  });

  it('should default to 0 on invalid start', () => {
    expect(getNumberListFromRange({ minimum: NaN, maximum: 5, maxOptionCount: 5, multiple: 5 })).toEqual([0, 5]);
  });

  it('should default to start on invalid end', () => {
    expect(getNumberListFromRange({ minimum: 5, maximum: NaN, maxOptionCount: 5, multiple: 5 })).toEqual([5]);
  });

  it('should allow decimals only at the beginning and the end', () => {
    expect(getNumberListFromRange({ minimum: 0.5, maximum: 20.5, maxOptionCount: 5, multiple: 5 })).toEqual([0.5, 5, 10, 20, 20.5]);
    expect(getNumberListFromRange({ minimum: 0.2, maximum: 20.73, maxOptionCount: 5, multiple: 5 })).toEqual([0.2, 5, 10, 20, 20.73]);
  });

  it('should get the same number sent if the number does not have decimals', () => {
    expect(getDecimals(5)).toEqual(5);
  });

  it('should round the number with two decimals if the number has decimals', () => {
    expect(getDecimals(5.2)).toEqual('5.20');
  });
});

import { getFixedValueWithDecimals } from './getFixedValueWithDecimals';

describe('getFixedValueWithDecimals', () => {
  it('should return an integer', () => {
    expect(getFixedValueWithDecimals(23, 2)).toEqual('23');
  });

  it('should return a number with two decimals even if the value has one decimal', () => {
    expect(getFixedValueWithDecimals(23.3, 2)).toEqual('23.30');
  });

  it('should return a number with two decimals', () => {
    expect(getFixedValueWithDecimals(15.23, 2)).toEqual('15.23');
  });

  it('should return a number with three decimals', () => {
    expect(getFixedValueWithDecimals(15.233, 3)).toEqual('15.233');
  });
});

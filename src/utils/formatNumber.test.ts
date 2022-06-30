import { formatNumber } from './formatNumber';

describe('formatNumber', () => {
  it('should format a number', () => {
    expect(formatNumber(10)).toEqual('10');
    expect(formatNumber(10000)).toEqual('10,000');
  });

  it('should format a null or undefined number', () => {
    expect(formatNumber(null)).toEqual(undefined);
    expect(formatNumber(undefined)).toEqual(undefined);
  });
});

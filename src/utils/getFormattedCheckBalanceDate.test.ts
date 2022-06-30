import { getFormattedCheckBalanceDate } from './getFormattedCheckBalanceDate';

describe('getFormattedCheckBalanceDate', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-02-20T12:20:00.000Z').getTime());
  });

  it('should return Today', () => {
    expect(getFormattedCheckBalanceDate('2022-02-20T12:20:00.000Z')).toEqual('Today');
  });

  it('should return Yesterday', () => {
    expect(getFormattedCheckBalanceDate('2022-02-19T11:00:00.000Z')).toEqual('Yesterday');
  });

  it('should return N days ago', () => {
    expect(getFormattedCheckBalanceDate('2022-02-18T12:20:00.000Z')).toEqual('2d ago');
  });

  it('should return date', () => {
    expect(getFormattedCheckBalanceDate('2022-01-09T12:20:00.000Z')).toEqual('42d ago');
  });
});

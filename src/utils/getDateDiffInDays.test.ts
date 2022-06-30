import { getDateDiffInDays } from './getDateDiffInDays';

describe('getDateDiffInDays', () => {
  it('should return zero if dates are in the same day', () => {
    expect(getDateDiffInDays('2020-07-20T00:00:00.000Z', '2020-07-20T12:00:00.000Z')).toEqual(0);
  });

  it('should return one if end date is on next day even if they are less than 24 hours in difference', () => {
    expect(getDateDiffInDays('2020-07-20T16:00:00.000Z', '2020-07-21T02:00:00.000Z')).toEqual(1);
  });

  it('should return one if end date is on next day even if they are more than 24 hours in difference', () => {
    expect(getDateDiffInDays('2020-07-20T02:00:00.000Z', '2020-07-21T22:00:00.000Z')).toEqual(1);
  });

  it('should return number of difference days', () => {
    expect(getDateDiffInDays('2020-07-20T00:00:00.000Z', '2020-07-30T00:00:00.000Z')).toEqual(10);
  });
});

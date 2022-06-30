import { formatDateToMonthDayHourMins } from './formatDateToMonthDayHourMins';

describe('formatDateToDayAndMonth', () => {
  it('should format a date', () => {
    expect(formatDateToMonthDayHourMins('2019-10-30T00:00:00.000Z')).toBeTruthy();
  });

  it('should return an empty string if date is undefined', () => {
    expect(formatDateToMonthDayHourMins(undefined)).toEqual('');
  });
});

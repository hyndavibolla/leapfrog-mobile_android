import { formatDateToDayAndMonth } from './formatDateToDayAndMonth';

describe('formatDateToDayAndMonth', () => {
  it('should format a date', () => {
    expect(formatDateToDayAndMonth('2020-07-20T12:00:00.000Z')).toEqual('July 20th');
  });

  it('should return an empty string if date is undefined', () => {
    expect(formatDateToDayAndMonth(undefined)).toEqual('');
  });
});

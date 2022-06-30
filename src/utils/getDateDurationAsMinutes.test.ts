import { getDateDurationAsMinutes } from './getDateDurationAsMinutes';

describe('getDateDiffInDays', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2021-07-20T12:20:00.000Z').getTime());
  });

  it('should return 20 minutes', () => {
    expect(getDateDurationAsMinutes('2021-07-20T12:00:00.000Z')).toEqual(20);
  });
});

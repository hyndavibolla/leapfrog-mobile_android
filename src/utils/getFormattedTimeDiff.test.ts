import { getFormattedTimeDiff } from './getFormattedTimeDiff';

describe('getFormattedTimeDiff', () => {
  it('should format a time difference of a month', () => {
    expect(getFormattedTimeDiff('2020-07-20T00:00:00.000Z', '2020-06-20T00:00:00.000Z')).toEqual('a month');
  });

  it('should format a time difference of a day', () => {
    expect(getFormattedTimeDiff('2020-07-20T00:00:00.000Z', '2020-07-21T00:00:00.000Z')).toEqual('a day');
  });

  it('should format a time difference of an hour', () => {
    expect(getFormattedTimeDiff('2020-07-20T00:00:00.000Z', '2020-07-20T01:00:00.000Z')).toEqual('an hour');
  });

  it('should format a time difference of 2 hours', () => {
    expect(getFormattedTimeDiff('2020-07-20T00:00:00.000Z', '2020-07-20T02:00:00.000Z')).toEqual('2 hours');
  });

  it('should format a time difference of minutes', () => {
    expect(getFormattedTimeDiff('2020-07-20T00:00:00.000Z', '2020-07-20T00:05:00.000Z')).toEqual('5 minutes');
  });
});

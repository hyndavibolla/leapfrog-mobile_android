import { getIsSameDate } from './getIsSameDate';

describe('getIsSameDate', () => {
  it('dates should be equal', () => {
    expect(getIsSameDate('2022-02-20T12:20:00.000Z', '2022-02-20T12:20:00.000Z')).toEqual(true);
  });

  it('dates should not be equal', () => {
    expect(getIsSameDate('2022-02-20T12:20:00.000Z', '2022-02-21T12:20:00.000Z')).toEqual(false);
  });
});

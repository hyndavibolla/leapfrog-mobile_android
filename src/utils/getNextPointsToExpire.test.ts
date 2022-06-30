import { getNextPointsToExpire } from './getNextPointsToExpire';

describe('getNextPointsToExpire', () => {
  let oneDay: number;
  let today: number;
  Date.now = () => today;
  beforeEach(() => {
    oneDay = 24 * 60 * 60 * 1000;
    today = oneDay * 3;
    Date.now = () => today;
  });

  it('should return null when point list is empty', () => {
    expect(getNextPointsToExpire([])).toEqual(null);
  });

  it('should return a default value when no points are next to expire', () => {
    expect(getNextPointsToExpire([{ memberOwnPoints: 1000, memberOwnExpiryDate: today - oneDay }])).toEqual({
      memberOwnPoints: 0,
      memberOwnExpiryDate: null
    });
  });

  it('should get expiring points from a list containing expired and non expired points', () => {
    expect(
      getNextPointsToExpire([
        { memberOwnPoints: 1000, memberOwnExpiryDate: today },
        { memberOwnPoints: 1000, memberOwnExpiryDate: today - oneDay },
        { memberOwnPoints: 1000, memberOwnExpiryDate: today + oneDay }
      ])
    ).toEqual({ memberOwnPoints: 1000, memberOwnExpiryDate: today });
  });

  it('should get group expiring points on the same day', () => {
    expect(
      getNextPointsToExpire([
        { memberOwnPoints: 1000, memberOwnExpiryDate: today + 1 },
        { memberOwnPoints: 1000, memberOwnExpiryDate: today },
        { memberOwnPoints: 1000, memberOwnExpiryDate: today + oneDay }
      ])
    ).toEqual({ memberOwnPoints: 2000, memberOwnExpiryDate: today + 1 });
  });
});

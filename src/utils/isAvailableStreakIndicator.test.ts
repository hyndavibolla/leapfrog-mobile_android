import { getMission_1, getMission_2 } from '../test-utils/entities';
import { isAvailableStreakIndicator } from './isAvailableStreakIndicator';

describe('isAvailableStreakIndicator', () => {
  it('returns true for mission 1 with streak reward', () => {
    const mission = getMission_1();
    expect(isAvailableStreakIndicator(mission)).toBe(true);
  });
  it('returns false for mission 2 without streak reward', () => {
    const mission = getMission_2();
    expect(isAvailableStreakIndicator(mission)).toBe(false);
  });
});

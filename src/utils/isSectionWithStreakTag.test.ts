import { EarnSections } from '_modules/earn/screens/EarnMain/constants';
import { GROCERY_AND_DELIVERY_CATEGORY } from '_constants/constants';

import { isSectionWithStreakTag } from './isSectionWithStreakTag';

describe('isSectionWithStreakTag', () => {
  it('should return false when title contains "Grocery & Delivery"', () => {
    const result = isSectionWithStreakTag(GROCERY_AND_DELIVERY_CATEGORY);
    expect(result).toBeFalsy();
  });

  it('should return false when sectionName is "activeMissionOffers"', () => {
    const result = isSectionWithStreakTag('Whatever title', EarnSections.ACTIVE_MISSION_OFFERS);
    expect(result).toBeFalsy();
  });

  it('should return true when title does not contain "Grocery & Delivery"', () => {
    const result = isSectionWithStreakTag('Whatever title');
    expect(result).toBeTruthy();
  });

  it('should return true when sectionName is not "activeMissionOffers"', () => {
    const result = isSectionWithStreakTag('Whatever title', EarnSections.CLAIM_YOUR_REWARDS);
    expect(result).toBeTruthy();
  });
});

import { GROCERY_AND_DELIVERY_CATEGORY } from '_constants/constants';
import { EarnSections } from '_modules/earn/screens/EarnMain/constants';

export const isSectionWithStreakTag = (sectionTitle: string, sectionName?: string) => {
  if (sectionTitle.includes(GROCERY_AND_DELIVERY_CATEGORY) || sectionName === EarnSections.ACTIVE_MISSION_OFFERS) return false;
  return true;
};

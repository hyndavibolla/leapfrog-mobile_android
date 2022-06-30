import { OfferModel } from '_models';
import { IMission } from '_models/mission';

export const isAvailableStreakIndicator = ({ pointsAwarded: { conditions } }: IMission) => {
  return conditions.some(({ programType }) => programType === OfferModel.ProgramType.STREAK);
};

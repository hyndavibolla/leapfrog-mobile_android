import { ActivityModel, OfferModel } from '_models';
import { getBrandName } from './mapBrand';
import { isGiftCard } from './isGiftCard';
import { shouldShowFeature } from '_components/Flagged';
import { FeatureFlag } from '_models/general';

export const getActivityDisplayName = (activity: ActivityModel.IActivity, offer?: OfferModel.IOffer) => {
  const { requestorName } = activity;

  const isGiftCardType = isGiftCard(activity) && (!offer || offer.pointsType === OfferModel.PointsType.REDEEM);
  if (requestorName) return `${getBrandName(activity.requestorName)}${isGiftCardType ? ' Gift Card' : ''}`;
  if (isGiftCardType) return 'Gift Card purchase';
  if (offer && offer.programType === OfferModel.ProgramType.CARDLINK) return 'MAX In Store Offer';
  if (offer.programType === OfferModel.ProgramType.STREAK || offer.programSubCategory === OfferModel.ProgramSubCategory.MISSION) {
    return 'MAX Mission';
  }
  if (shouldShowFeature(FeatureFlag.SURVEY) && offer.programSubCategory === OfferModel.ProgramSubCategory.SURVEY) {
    return 'MAX Surveys';
  }
  if (offer && !!offer.programType) return 'MAX Offer';
  return 'New activity';
};

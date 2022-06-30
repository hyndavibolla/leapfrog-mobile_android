import { ActivityModel, OfferModel } from '_models';

/**
 * Returns if a transaction is gift card type
 * @param activity
 */
export const isGiftCard = (activity: ActivityModel.IActivity) => {
  return (
    activity.activityType === ActivityModel.Type.REDEMPTION ||
    !!activity.activityDetails?.giftCardValue ||
    activity.offers?.some(offer => offer.pointsType === OfferModel.PointsType.REDEEM)
  );
};

import { isGiftCard } from './isGiftCard';
import { ActivityModel } from '_models';
import { getActivity_1, getActivity_3, getActivity_4 } from '_test_utils/entities';

describe('isGiftCard', () => {
  it('should return false when activityType is not redemption and offer is undefined and gift card value is null', () => {
    expect(isGiftCard(getActivity_3())).toEqual(false);
  });

  it('should return false when activityType is not redemption and pointsType is not redeem', () => {
    expect(isGiftCard(getActivity_1())).toEqual(false);
  });

  it('should return true when activityType is redemption and pointsType is not redeem', () => {
    const activity = { ...getActivity_1(), activityType: ActivityModel.Type.REDEMPTION };
    expect(isGiftCard(activity)).toEqual(true);
  });

  it('should return true when activityType is redemption and pointsType is redeem', () => {
    const activity = { ...getActivity_1(), activityType: ActivityModel.Type.REDEMPTION };
    expect(isGiftCard(activity)).toEqual(true);
  });

  it('should return true when activityType is not redemption and offer is undefined and giftCardValue has a value', () => {
    expect(isGiftCard(getActivity_4())).toEqual(true);
  });

  it('should return false when activityType is not redemption and pointsType is not redeem and giftCardValue is null', () => {
    expect(isGiftCard(getActivity_1())).toEqual(false);
  });
});

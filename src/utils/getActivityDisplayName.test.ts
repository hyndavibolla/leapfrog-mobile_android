import { getActivityDisplayName } from './getActivityDisplayName';
import { ActivityModel, OfferModel } from '_models';
import { getActivity_1, getActivity_5, getOffer_5 } from '_test_utils/entities';

describe('getActivityDisplayName', () => {
  it('should return a default value when programSubCategory and the requestor brand are undefined and activity type is not redemption and points type is not redeem', () => {
    expect(getActivityDisplayName(getActivity_5(), getOffer_5())).toEqual('New activity');
  });

  it('should return the requestor', () => {
    expect(getActivityDisplayName(getActivity_1(), getOffer_5())).toEqual('requestor one');
  });

  it('should return brand name + gift card when activity is a gift card and offer is not set', () => {
    const activity = { ...getActivity_1(), activityType: ActivityModel.Type.REDEMPTION };
    expect(getActivityDisplayName(activity)).toEqual('requestor one Gift Card');
  });

  it('should return brand name + gift card when activity is a gift card and offer is set but is a redeem', () => {
    const activity = { ...getActivity_1(), activityType: ActivityModel.Type.REDEMPTION };
    const offer = { ...getOffer_5(), pointsType: OfferModel.PointsType.REDEEM };
    expect(getActivityDisplayName(activity, offer)).toEqual('requestor one Gift Card');
  });

  it('should return brand name + gift card when pointsType is redeem', () => {
    const activity = { ...getActivity_1(), activityType: ActivityModel.Type.REDEMPTION };
    const offer = { ...getOffer_5(), pointsType: OfferModel.PointsType.REDEEM };
    expect(getActivityDisplayName(activity, offer)).toEqual('requestor one Gift Card');
  });

  it('should return gift card purchase when requestor name is undefined and activityType is redemption and offer is not set', () => {
    const activity = { ...getActivity_5(), activityType: ActivityModel.Type.REDEMPTION };
    expect(getActivityDisplayName(activity)).toEqual('Gift Card purchase');
  });

  it('should return gift card purchase when requestor name is undefined and activityType is redemption and offer is set but is a redeem', () => {
    const activity = { ...getActivity_5(), activityType: ActivityModel.Type.REDEMPTION };
    const offer = { ...getOffer_5(), pointsType: OfferModel.PointsType.REDEEM };
    expect(getActivityDisplayName(activity, offer)).toEqual('Gift Card purchase');
  });

  it('should return gift card purchase when requestor name is undefined and pointsType is redeem', () => {
    const activity = { ...getActivity_5(), activityType: ActivityModel.Type.REDEMPTION };
    const offer = { ...getOffer_5(), pointsType: OfferModel.PointsType.REDEEM };
    expect(getActivityDisplayName(activity, offer)).toEqual('Gift Card purchase');
  });

  it('should return Max in store offer if programType is CARDLINK', () => {
    const offer = { ...getOffer_5(), programType: OfferModel.ProgramType.CARDLINK };
    expect(getActivityDisplayName(getActivity_5(), offer)).toEqual('MAX In Store Offer');
  });

  it('should return Max Mission if programType is STREAK', () => {
    const offer = { ...getOffer_5(), programType: OfferModel.ProgramType.STREAK };
    expect(getActivityDisplayName(getActivity_5(), offer)).toEqual('MAX Mission');
  });

  it('should return Max Mission if programSubCategory is MISSION', () => {
    const offer = { ...getOffer_5(), programSubCategory: OfferModel.ProgramSubCategory.MISSION };
    expect(getActivityDisplayName(getActivity_5(), offer)).toEqual('MAX Mission');
  });

  it('should return Max Surveys if programSubCategory is SURVEY', () => {
    const offer = { ...getOffer_5(), programSubCategory: OfferModel.ProgramSubCategory.SURVEY };
    expect(getActivityDisplayName(getActivity_5(), offer)).toEqual('MAX Surveys');
  });

  it('should return Max Offer if programType is ONBOARDING', () => {
    const offer = { ...getOffer_5(), programType: OfferModel.ProgramType.ONBOARDING };
    expect(getActivityDisplayName(getActivity_5(), offer)).toEqual('MAX Offer');
  });
});

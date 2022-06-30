import React from 'react';
import { act } from 'react-test-renderer';

import ActivityDetail, { Props } from './ActivityDetail';
import { getActivity_1, getOffer_1, getOffer_2, getActivity_5, getActivity_6, getOffer_4, getSurvey_1, getOffer_7 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';
import { ProgramType } from '_models/offer';
import { ActivityModel, OfferModel } from '_models';
import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { wait } from '_utils/wait';

describe('ActivityDetail', () => {
  let deps: Deps;
  let props: Props;
  let initialState: IGlobalState;

  const originalDateNow = Date.now.bind(null);

  beforeEach(() => {
    initialState = getInitialState();
    initialState.game.current.missions.pointsPerCent = 10;
    deps = getMockDeps();
    props = {
      activity: getActivity_1(),
      offer: getOffer_1()
    };
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<ActivityDetail {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without an icon', async () => {
    props.activity.brandDetails.brandLogo = null;
    const { toJSON } = renderWithGlobalContext(<ActivityDetail {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without a requestor name', async () => {
    props.activity.requestorName = null;
    const { toJSON } = renderWithGlobalContext(<ActivityDetail {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render locked', () => {
    Date.now = () => 1980;
    props.offer.pointStartDate = 2000;
    props.offer.pointEndDate = 3000;
    const { toJSON } = renderWithGlobalContext(<ActivityDetail {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render an expired activity', async () => {
    props.activity.activityType = ActivityModel.Type.EXPIRY;
    props.offer.pointsType = OfferModel.PointsType.POINTS_EXPIRY;
    const { toJSON } = renderWithGlobalContext(<ActivityDetail {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render an returned activity', async () => {
    props.activity.activityType = ActivityModel.Type.RETURN;
    const { toJSON } = renderWithGlobalContext(<ActivityDetail {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render an activity with pending confirmation points', async () => {
    props.offer.pointStartDate = 99999;
    const { toJSON } = renderWithGlobalContext(<ActivityDetail {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not render the company description if the points are coming from redeem points', async () => {
    props.offer.pointsType = OfferModel.PointsType.REDEEM;
    const { toJSON } = renderWithGlobalContext(<ActivityDetail {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not render the availability date if it is null', async () => {
    props.offer.pointsType = OfferModel.PointsType.REDEEM;
    props.offer.pointStartDate = null;
    const { toJSON } = renderWithGlobalContext(<ActivityDetail {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a streak activity', async () => {
    const { toJSON } = renderWithGlobalContext(<ActivityDetail activity={getActivity_5()} offer={getOffer_4()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a streak activity by rewardOfferCode', async () => {
    const { toJSON } = renderWithGlobalContext(<ActivityDetail activity={getActivity_5()} offer={getOffer_7()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a survey activity', async () => {
    const { toJSON } = renderWithGlobalContext(<ActivityDetail activity={getActivity_6()} offer={getSurvey_1()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render an in store offer activity', async () => {
    props.offer.programSubCategory = undefined;
    props.offer.pointsType = undefined;
    props.offer.programType = ProgramType.CARDLINK;
    const { toJSON } = renderWithGlobalContext(<ActivityDetail {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not render the timestamp date if it is null', async () => {
    props.activity.timestamp = null;
    const { queryByTestId } = renderWithGlobalContext(<ActivityDetail {...props} />);
    await act(() => wait(0));
    expect(queryByTestId('activity-detail-transaction-date')).not.toBeTruthy();
  });

  it('should not render total order and payment method if its not a gift card ', async () => {
    const { queryByTestId } = renderWithGlobalContext(<ActivityDetail {...props} />);
    expect(queryByTestId('activity-detail-total-order')).toBeNull();
    expect(queryByTestId('activity-detail-payment-method')).toBeNull();
  });

  it('should not render points pill there are no points', async () => {
    props.offer.points = 0;
    const { queryByTestId } = renderWithGlobalContext(<ActivityDetail {...props} />);
    expect(queryByTestId('activity-detail-points-summary-modal-label')).toBeNull();
  });

  it('should render payment method credit card if it is a gift card and there are not redeem points', () => {
    props.activity.activityType = ActivityModel.Type.REDEMPTION;
    const { getByTestId } = renderWithGlobalContext(<ActivityDetail {...props} />, deps, initialState);
    expect(getByTestId('activity-detail-payment-method')).toHaveTextContent('Credit Card');
  });

  it('should render payment method points if it is a gift card and there are only redeem points', () => {
    props.activity.activityType = ActivityModel.Type.REDEMPTION;
    props.activity.offers[0].pointsType = OfferModel.PointsType.REDEEM;
    const { getByTestId } = renderWithGlobalContext(<ActivityDetail {...props} />, deps, initialState);
    expect(getByTestId('activity-detail-payment-method')).toHaveTextContent('Points Only');
  });

  it('should render payment method mixed if it is a gift card and there are both redeem and not redeem points, and the sum of redeem is lower than grossSpend', () => {
    props.activity.activityType = ActivityModel.Type.REDEMPTION;
    props.activity.offers[0].pointsType = OfferModel.PointsType.REDEEM;
    props.activity.offers.push({ ...getOffer_2(), pointsType: OfferModel.PointsType.EARN });
    props.activity.grossSpend = props.activity.offers[0].points + props.activity.offers[1].points + 100;
    const { getByTestId } = renderWithGlobalContext(<ActivityDetail {...props} />, deps, initialState);
    expect(getByTestId('activity-detail-payment-method')).toHaveTextContent('Points + Credit Card');
  });

  it('should render payment method mixed if it is a gift card and there are both redeem and not redeem points, and the sum of redeem is lower than gift card value', () => {
    props.activity.activityType = ActivityModel.Type.REDEMPTION;
    props.activity.offers[0].pointsType = OfferModel.PointsType.REDEEM;
    props.activity.offers.push({ ...getOffer_2(), pointsType: OfferModel.PointsType.EARN });
    props.activity.activityDetails.giftCardValue = props.activity.offers[0].points + props.activity.offers[1].points + 100;
    const { getByTestId } = renderWithGlobalContext(<ActivityDetail {...props} />, deps, initialState);
    expect(getByTestId('activity-detail-payment-method')).toHaveTextContent('Points + Credit Card');
  });

  it('should render total order if activity grossSpend and activity details are null and it is a gift card', () => {
    props.activity.activityType = ActivityModel.Type.REDEMPTION;
    props.offer.pointsType = OfferModel.PointsType.REDEEM;
    props.activity.grossSpend = null;
    props.activity.activityDetails = null;
    const { getByTestId } = renderWithGlobalContext(<ActivityDetail {...props} />, deps, initialState);
    expect(getByTestId('activity-detail-total-order')).toBeTruthy();
  });

  it('should render total order if activity grossSpend and activity details and dollarRedeemed are null and it is a gift card', () => {
    props.activity.activityType = ActivityModel.Type.REDEMPTION;
    props.offer.pointsType = OfferModel.PointsType.REDEEM;
    props.offer.dollarRedeemed = null;
    props.activity.grossSpend = null;
    props.activity.activityDetails = null;
    const { getByTestId } = renderWithGlobalContext(<ActivityDetail {...props} />, deps, initialState);
    expect(getByTestId('activity-detail-total-order')).toBeTruthy();
  });

  it('should render total order if grossSpend is higher than points converted to usd and it is a gift card', () => {
    props.activity.activityType = ActivityModel.Type.REDEMPTION;
    props.offer.pointsType = OfferModel.PointsType.REDEEM;
    props.activity.grossSpend = 100;
    props.activity.activityDetails = null;
    props.offer.dollarRedeemed = null;
    props.offer.points = 100;
    const { getByTestId } = renderWithGlobalContext(<ActivityDetail {...props} />, deps, initialState);
    expect(getByTestId('activity-detail-total-order')).toBeTruthy();
  });

  it('should render total order if giftCardValue is higher than points converted to usd and it is a gift card', async () => {
    props.offer.pointsType = OfferModel.PointsType.REDEEM;
    props.offer.dollarRedeemed = null;
    props.activity.grossSpend = null;
    props.activity.activityDetails.giftCardValue = 100;
    const { queryByTestId } = renderWithGlobalContext(<ActivityDetail {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(queryByTestId('activity-detail-total-order')).toBeTruthy();
  });
});

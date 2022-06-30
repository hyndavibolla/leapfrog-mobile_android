import React from 'react';

import PointRow, { Props } from './PointRow';
import { getOffer_1, getActivity_1, getActivity_5, getActivity_6, getOffer_4, getSurvey_1 } from '../../../../test-utils/entities';
import { ActivityModel, OfferModel } from '../../../../models';
import { ProgramType } from '../../../../models/offer';
import { renderWithGlobalContext } from '../../../../test-utils/renderWithGlobalContext';

describe('PointRow', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      activity: getActivity_1(),
      offer: getOffer_1()
    };
  });

  it('should render', () => {
    props.activity.activityType = ActivityModel.Type.AVAILABLE;
    const { toJSON } = renderWithGlobalContext(<PointRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render expired', () => {
    props.offer.pointsType = OfferModel.PointsType.POINTS_EXPIRY;
    const { toJSON } = renderWithGlobalContext(<PointRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render returned', () => {
    props.activity.activityType = ActivityModel.Type.RETURN;
    const { toJSON } = renderWithGlobalContext(<PointRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render locked', () => {
    props.offer.pointStartDate = Date.now() + 99999;
    const { toJSON } = renderWithGlobalContext(<PointRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render burned', () => {
    const { toJSON } = renderWithGlobalContext(<PointRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without a requestor image', () => {
    props.activity.brandDetails.brandLogo = null;
    const { toJSON } = renderWithGlobalContext(<PointRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without requestor name or offer name', () => {
    props.activity.requestorName = null;
    props.offer.name = null;
    const { toJSON } = renderWithGlobalContext(<PointRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a streak activity', async () => {
    const offer = getOffer_4();
    offer.isStreak = true;
    const { toJSON } = renderWithGlobalContext(<PointRow activity={getActivity_5()} offer={offer} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a survey activity', async () => {
    const { toJSON } = renderWithGlobalContext(<PointRow activity={getActivity_6()} offer={getSurvey_1()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render an in store offer activity', async () => {
    props.offer.programSubCategory = undefined;
    props.offer.pointsType = undefined;
    props.offer.programType = ProgramType.CARDLINK;
    const { toJSON } = renderWithGlobalContext(<PointRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render for gift card without date', async () => {
    props.activity.activityType = ActivityModel.Type.REDEMPTION;
    props.offer.programSubCategory = undefined;
    props.offer.pointsType = OfferModel.PointsType.REDEEM;
    props.activity.timestamp = null;
    const { getByTestId } = renderWithGlobalContext(<PointRow {...props} />);
    expect(getByTestId('point-row-description-label')).toHaveTextContent('');
  });

  it('should render a fallback text in the pill if points are empty', () => {
    props.offer.points = null;
    const { getByTestId } = renderWithGlobalContext(<PointRow {...props} />);
    expect(getByTestId('pill-text-fallback')).toBeTruthy();
  });
});

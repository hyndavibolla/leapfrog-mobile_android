import React from 'react';

import ActivityItem, { Props } from './ActivityItem';
import { getActivity_1, getOffer_1 } from '../../../test-utils/entities';
import { ActivityModel, OfferModel } from '../../../models';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { ProgramSubCategory, ProgramType } from '../../../models/offer';

describe('ActivityItem', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      activity: getActivity_1(),
      offer: getOffer_1()
    };
  });

  it('should a render a pending activity', () => {
    props.offer.pointStartDate = Date.now() + 99999;
    props.activity.activityType = ActivityModel.Type.ADJUSTMENT; // neither returned or expired
    const { toJSON } = renderWithGlobalContext(<ActivityItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should a render an available activity', () => {
    props.offer.pointStartDate = Date.now() - 99999;
    const { toJSON } = renderWithGlobalContext(<ActivityItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a returned activity', () => {
    props.activity.activityType = ActivityModel.Type.RETURN;
    const { toJSON } = renderWithGlobalContext(<ActivityItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render an expired activity', () => {
    props.offer.pointsType = OfferModel.PointsType.POINTS_EXPIRY;
    const { toJSON } = renderWithGlobalContext(<ActivityItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a streak activity', async () => {
    props.offer.programType = ProgramType.STREAK;
    const { toJSON } = renderWithGlobalContext(<ActivityItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a survey activity', async () => {
    props.offer.programSubCategory = ProgramSubCategory.SURVEY;
    const { toJSON } = renderWithGlobalContext(<ActivityItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render an in store offer activity', async () => {
    props.offer.programSubCategory = undefined;
    props.offer.programType = ProgramType.CARDLINK;
    const { toJSON } = renderWithGlobalContext(<ActivityItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not render a subtitle if it does not have one', () => {
    props.offer.name = '';
    props.offer.pointStartDate = null;
    const { queryByTestId } = renderWithGlobalContext(<ActivityItem {...props} />);
    expect(queryByTestId('activity-item-subtitle')).toBeNull();
  });
});

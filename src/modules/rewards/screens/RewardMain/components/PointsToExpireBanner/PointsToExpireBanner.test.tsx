import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { PointsToExpireBanner, Props } from './PointsToExpireBanner';

describe('PointsToExpireBanner', () => {
  let props: Props;
  let oneDay: number;
  let today: number;
  Date.now = () => today;

  beforeEach(() => {
    oneDay = 24 * 60 * 60 * 1000;
    today = oneDay * 3;
    Date.now = () => today;
    props = {
      expirePointsBannerDataSet: { lastPointsDate: today + 1, lastAcceptedDate: today * 2 },
      memberOwnPointsToExpire: [
        { memberOwnPoints: 1000, memberOwnExpiryDate: today + 1 },
        { memberOwnPoints: 1000, memberOwnExpiryDate: today },
        { memberOwnPoints: 1000, memberOwnExpiryDate: today + oneDay }
      ]
    };
  });

  it('should render', () => {
    const { getByTestId } = renderWithGlobalContext(<PointsToExpireBanner {...props} />);
    expect(getByTestId('reward-banner-container')).toBeTruthy();
  });

  it('should render with expiring points in 16 days', () => {
    props.expirePointsBannerDataSet = null;
    props.memberOwnPointsToExpire = [{ memberOwnPoints: 1000, memberOwnExpiryDate: today + oneDay * 16 }];
    const { getByTestId } = renderWithGlobalContext(<PointsToExpireBanner {...props} />);
    expect(getByTestId('reward-banner-turn-points-icon')).toBeTruthy();
  });

  it('should not render with expiring points in 16 days', () => {
    props.expirePointsBannerDataSet = { lastPointsDate: today + 1, lastAcceptedDate: today };
    props.memberOwnPointsToExpire = [];
    const { queryByTestId } = renderWithGlobalContext(<PointsToExpireBanner {...props} />);
    expect(queryByTestId('reward-banner-turn-points-icon')).toBeNull();
  });

  it('should render with expiring points today', () => {
    props.memberOwnPointsToExpire = [{ memberOwnPoints: 1000, memberOwnExpiryDate: today }];
    const { getByTestId } = renderWithGlobalContext(<PointsToExpireBanner {...props} />);
    expect(getByTestId('reward-banner-expiration-date').props.children).toEqual('today');
  });

  it('should render with expiring points tomorrow', () => {
    props.memberOwnPointsToExpire = [{ memberOwnPoints: 1000, memberOwnExpiryDate: today + oneDay }];
    const { getByTestId } = renderWithGlobalContext(<PointsToExpireBanner {...props} />);
    expect(getByTestId('reward-banner-expiration-date').props.children).toEqual('tomorrow');
  });

  it('should render with expiring points in 2 days', () => {
    props.memberOwnPointsToExpire = [{ memberOwnPoints: 1000, memberOwnExpiryDate: today + oneDay * 2 }];
    const { getByTestId } = renderWithGlobalContext(<PointsToExpireBanner {...props} />);
    expect(getByTestId('reward-banner-expiration-date').props.children).toEqual('in 2 days');
  });

  it('should not render with expiring points today', () => {
    props.expirePointsBannerDataSet = { lastPointsDate: today, lastAcceptedDate: today };
    props.memberOwnPointsToExpire = [{ memberOwnPoints: 1000, memberOwnExpiryDate: today }];
    const { queryByTestId } = renderWithGlobalContext(<PointsToExpireBanner {...props} />);
    expect(queryByTestId('reward-banner-expiration-date')).toBeNull();
  });

  it('should not render with expiring points tomorrow', () => {
    props.expirePointsBannerDataSet = { lastPointsDate: today + oneDay, lastAcceptedDate: today };
    props.memberOwnPointsToExpire = [{ memberOwnPoints: 1000, memberOwnExpiryDate: today + oneDay }];
    const { queryByTestId } = renderWithGlobalContext(<PointsToExpireBanner {...props} />);
    expect(queryByTestId('reward-banner-expiration-date')).toBeNull();
  });

  it('should not render with expiring points in 2 days', () => {
    props.expirePointsBannerDataSet = { lastPointsDate: today + oneDay * 2, lastAcceptedDate: today };
    props.memberOwnPointsToExpire = [{ memberOwnPoints: 1000, memberOwnExpiryDate: today + oneDay * 2 }];
    const { queryByTestId } = renderWithGlobalContext(<PointsToExpireBanner {...props} />);
    expect(queryByTestId('reward-banner-expiration-date')).toBeNull();
  });

  it('should render with expiring points in 5 days', () => {
    props.expirePointsBannerDataSet = { lastPointsDate: today + oneDay * 5, lastAcceptedDate: today - oneDay * 16 };
    props.memberOwnPointsToExpire = [{ memberOwnPoints: 1000, memberOwnExpiryDate: today + oneDay * 5 }];
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<PointsToExpireBanner {...props} />);
    fireEvent.press(getByTestId('reward-banner-close-banner'));
    expect(getByTestId('reward-banner-expiration-date').props.children).toEqual('in 5 days');
    expect(queryByTestId('reward-banner-turn-points-icon')).toBeNull();
  });
});

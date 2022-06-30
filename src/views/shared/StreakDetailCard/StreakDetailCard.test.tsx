import React from 'react';

import { getStreak_1 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import StreakDetailCard, { Props } from './StreakDetailCard';

describe('StreakDetailCard', () => {
  Date.now = () => 1980;
  let props: Props;
  beforeEach(() => {
    props = {
      streak: getStreak_1(),
      brandName: 'brand name :D'
    };
  });

  it('should render', () => {
    props.streak.currentQualifiedValue = 1;
    props.streak.thresholdValue = 3;
    const { toJSON, queryByTestId } = renderWithGlobalContext(<StreakDetailCard {...props} />);
    expect(queryByTestId('streak-detail-card-complete')).toBeFalsy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render close to end date', () => {
    props.streak.currentQualifiedValue = 1;
    props.streak.thresholdValue = 3;
    props.streak.endDt = 1980 + 1000 * 60 * 60 * 24 * 2; /** 2 days */
    const { toJSON, queryByTestId } = renderWithGlobalContext(<StreakDetailCard {...props} />);
    expect(queryByTestId('streak-detail-card-complete')).toBeFalsy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render complete', () => {
    props.streak.currentQualifiedValue = 3;
    props.streak.thresholdValue = 3;
    const { toJSON, queryByTestId } = renderWithGlobalContext(<StreakDetailCard {...props} />);
    expect(queryByTestId('streak-detail-card-complete')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with expired streak', () => {
    props.streak.endDt = Date.now();
    props.streak.currentQualifiedValue = 1;
    props.streak.thresholdValue = 3;
    const { toJSON } = renderWithGlobalContext(<StreakDetailCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

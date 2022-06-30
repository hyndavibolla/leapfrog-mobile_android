import React from 'react';

import LargeStreakCard, { Props } from './LargeStreakCard';
import { getStreak_1 } from '../../../test-utils/entities';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

describe('LargeStreakCard', () => {
  Date.now = () => 1980;
  let props: Props;
  beforeEach(() => {
    props = {
      onPress: jest.fn(),
      streak: getStreak_1()
    };
  });

  it('should render', () => {
    props.streak.currentQualifiedValue = 1;
    props.streak.thresholdValue = 3;
    const { toJSON, queryByTestId } = renderWithGlobalContext(<LargeStreakCard {...props} />);
    expect(queryByTestId('large-streak-card-complete')).toBeFalsy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render complete', () => {
    props.streak.currentQualifiedValue = 3;
    props.streak.thresholdValue = 3;
    const { toJSON, queryByTestId } = renderWithGlobalContext(<LargeStreakCard {...props} />);
    expect(queryByTestId('large-streak-card-complete')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with ended streak', () => {
    props.streak.currentQualifiedValue = 1;
    props.streak.thresholdValue = 3;
    props.streak.endDt = Date.now();
    const { toJSON, queryByTestId } = renderWithGlobalContext(<LargeStreakCard {...props} />);
    expect(queryByTestId('large-streak-card-ended')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});

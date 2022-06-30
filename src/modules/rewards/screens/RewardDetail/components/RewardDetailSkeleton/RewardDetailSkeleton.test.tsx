import React from 'react';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import RewardDetailSkeleton from './RewardDetailSkeleton';

describe('Reward Detail Skeleton', () => {
  it('should render', () => {
    const { getByTestId } = renderWithGlobalContext(<RewardDetailSkeleton />);
    expect(getByTestId('reward-detail-skeleton-container')).toBeTruthy();
  });
});

import { fireEvent } from '@testing-library/react-native';
import React from 'react';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import RewardDetailEmptyState, { Props } from './RewardDetailEmptyState';

const mockOnPress = jest.fn();

describe('Reward Detail Empty State', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      onPress: mockOnPress
    };
  });

  it('should render', () => {
    const { getByTestId } = renderWithGlobalContext(<RewardDetailEmptyState {...props} />);
    expect(getByTestId('reward-detail-empty-state-container')).toBeTruthy();
  });

  it('should call onPress prop', () => {
    const { getByTestId } = renderWithGlobalContext(<RewardDetailEmptyState {...props} />);
    fireEvent.press(getByTestId('reward-detail-empty-state-close-btn'));
    expect(props.onPress).toBeCalled();
  });
});

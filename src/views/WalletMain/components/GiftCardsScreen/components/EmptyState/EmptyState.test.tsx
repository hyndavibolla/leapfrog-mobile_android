import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import EmptyState, { Props } from './EmptyState';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { ROUTES } from '_constants';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('EmptyState', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      title: 'A title'
    };
  });
  it('should render without description', () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<EmptyState {...props} />);
    expect(getByTestId('gift-cards-screen-empty-state-title')).toBeTruthy();
    expect(queryByTestId('gift-cards-screen-empty-state-description')).toBeNull();
  });

  it('should render with description', () => {
    props.description = 'this is a description';
    const { getByTestId } = renderWithGlobalContext(<EmptyState {...props} />);
    expect(getByTestId('gift-cards-screen-empty-state-title')).toBeTruthy();
    expect(getByTestId('gift-cards-screen-empty-state-description')).toBeTruthy();
  });

  it('should navigate to rewards if the user taps on the buy gift card button', () => {
    const { getByTestId } = renderWithGlobalContext(<EmptyState {...props} />);
    fireEvent.press(getByTestId('gift-cards-screen-empty-state-buy-gift-card-button'));
    expect(mockNavigate).toBeCalledWith(ROUTES.MAIN_TAB.REWARDS);
  });
});

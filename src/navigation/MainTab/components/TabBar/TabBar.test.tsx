import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { NavigationButtonType } from '_components/NavigationButton/NavigationButton';
import { ROUTES } from '_constants';

import TabBar, { Props, TabRoute } from './TabBar';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: mockNavigate })
}));

describe('TabBar', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      activeRoute: ROUTES.MAIN as TabRoute
    };
  });
  it('should render', () => {
    const { toJSON } = render(<TabBar {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should navigate', async () => {
    const { findByTestId } = render(<TabBar {...props} />);
    const button = await findByTestId(`navigation-button-${NavigationButtonType.REWARD}`);
    fireEvent.press(button);
    expect(mockNavigate).toBeCalledWith(ROUTES.MAIN_TAB.REWARDS);
  });
});

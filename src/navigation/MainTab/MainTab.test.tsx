import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { ROUTES } from '_constants';
import { Deps, IGlobalState } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getInitialState } from '_state_mgmt/GlobalState';
import { NavigationButtonType } from '_components/NavigationButton/NavigationButton';

import MainTab from './MainTab';

jest.mock('_modules/earn/screens/EarnMain', () => ({ __esModule: true, EarnMain: () => <div>EarnMain</div> }));

const { Screen, Navigator } = createStackNavigator();

describe('MainTab', () => {
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    Date.now = () => 1980;
    initialState = getInitialState();
    deps = getMockDeps();
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(
      <NavigationContainer>
        <Navigator>
          <Screen name={ROUTES.MAIN} component={MainTab} />
        </Navigator>
      </NavigationContainer>,
      deps,
      initialState
    );
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should navigate to reward tab ', async () => {
    const { getByTestId } = renderWithGlobalContext(
      <NavigationContainer>
        <Navigator>
          <Screen name={ROUTES.MAIN} component={MainTab} />
        </Navigator>
      </NavigationContainer>,
      deps,
      initialState
    );
    await waitFor(() => {
      const button = getByTestId(`navigation-button-${NavigationButtonType.REWARD}`);
      fireEvent.press(button);
    });
    expect(getByTestId('gift-card-group-list-container')).toBeTruthy();
  });

  it('should navigate to mission tab ', async () => {
    const { getByTestId } = renderWithGlobalContext(
      <NavigationContainer>
        <Navigator>
          <Screen name={ROUTES.MAIN} component={MainTab} />
        </Navigator>
      </NavigationContainer>,
      deps,
      initialState
    );
    await waitFor(() => {
      const button = getByTestId(`navigation-button-${NavigationButtonType.STREAK}`);
      fireEvent.press(button);
    });
    expect(getByTestId('streak-main-container')).toBeTruthy();
  });

  it('should navigate to wallet tab ', async () => {
    const { getByTestId } = renderWithGlobalContext(
      <NavigationContainer>
        <Navigator>
          <Screen name={ROUTES.MAIN} component={MainTab} />
        </Navigator>
      </NavigationContainer>,
      deps,
      initialState
    );
    await waitFor(() => {
      const button = getByTestId(`navigation-button-${NavigationButtonType.WALLET}`);
      fireEvent.press(button);
    });
    expect(getByTestId('redemptions-container')).toBeTruthy();
  });
});

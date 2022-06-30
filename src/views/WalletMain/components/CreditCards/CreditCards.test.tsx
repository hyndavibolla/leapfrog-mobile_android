import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CreditCards from './CreditCards';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { waitFor } from '@testing-library/react-native';
import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';

describe('Credit Cards', () => {
  let deps: Deps;
  let state: IGlobalState;
  let render;
  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
    const { Screen, Navigator } = createStackNavigator();
    render = (newProps, newDeps, newState) => {
      const Component = () => <CreditCards {...(newProps || {})} />;
      return renderWithGlobalContext(
        <NavigationContainer>
          <Navigator>
            <Screen name="route" component={Component} />
          </Navigator>
        </NavigationContainer>,
        newDeps,
        newState
      );
    };
  });

  it('should render', async () => {
    const { queryByTestId, getByTestId } = render(undefined, deps, state);
    await waitFor(() => {
      expect(queryByTestId('wallet-main-skeleton-container')).toBeNull();
      expect(getByTestId('credit-cards-container')).toBeTruthy();
    });
  });
});

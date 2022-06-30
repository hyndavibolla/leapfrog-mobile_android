import React from 'react';
import { waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { getInitialState } from '_state_mgmt/GlobalState';
import { Deps, IGlobalState } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import Redemptions from './Redemptions';

describe('Redemptions', () => {
  let deps: Deps;
  let initialState: IGlobalState;
  let render;

  beforeEach(() => {
    deps = getMockDeps();
    initialState = getInitialState();
    deps = getMockDeps();
    const { Screen, Navigator } = createStackNavigator();
    render = (d, s) => {
      const Component = () => <Redemptions />;
      return renderWithGlobalContext(
        <NavigationContainer>
          <Navigator>
            <Screen name="route" component={Component} />
          </Navigator>
        </NavigationContainer>,
        d,
        s,
        () => s
      );
    };
  });

  it('should render', async () => {
    const { queryByTestId, getByTestId } = render(deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('wallet-main-skeleton-container')).toBeNull();
      expect(getByTestId('redemptions-container')).toBeTruthy();
    });
  });

  it('should render syw card', async () => {
    initialState.game.current.memberships.userHasSywCard = true;
    const { queryByTestId, getByTestId } = render(deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('wallet-main-skeleton-container')).toBeNull();
      expect(getByTestId('redemptions-syw-card')).toBeTruthy();
      expect(getByTestId('redemptions-container')).toBeTruthy();
    });
  });

  it('should not render syw card', async () => {
    initialState.game.current.memberships.userHasSywCard = false;
    const { queryByTestId, getByTestId } = render(deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('wallet-main-skeleton-container')).toBeNull();
      expect(getByTestId('redemptions-container')).toBeTruthy();
      expect(queryByTestId('redemptions-syw-card')).toBeNull();
    });
  });
});

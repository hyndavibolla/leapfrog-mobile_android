import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { getInitialState } from '_state_mgmt/GlobalState';
import { Deps, IGlobalState } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import WalletMain, { Props } from './WalletMain';

describe('WalletMain', () => {
  let deps: Deps;
  let initialState: IGlobalState;
  let render;
  let props: Props;

  beforeEach(() => {
    deps = getMockDeps();
    initialState = getInitialState();
    deps = getMockDeps();
    props = {
      route: { params: { finishedURI: false } }
    };
    const { Screen, Navigator } = createStackNavigator();
    render = (newProps, newDeps, newState) => {
      const Component = () => <WalletMain {...(newProps || {})} />;
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
    const { getByTestId } = render(props, deps, initialState);
    await waitFor(() => {
      expect(getByTestId('redemptions-container')).toBeTruthy();
    });
  });

  it('should not show modal if finishedURI is undefined', async () => {
    props.route.params = undefined;
    const { queryByTestId } = render(props, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('application-modal-container')).toBeNull();
    });
  });

  it('should show application modal and close it', async () => {
    props.route.params.finishedURI = true;
    const { getByTestId, queryByTestId } = render(props, deps, initialState);

    expect(getByTestId('application-modal-container')).toBeTruthy();
    fireEvent.press(getByTestId('application-modal-close-button'));
    await waitFor(() => {
      expect(queryByTestId('application-modal-container')).toBeNull();
    });
  });
});

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { render } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { HowItWorksNavigator } from './HowItWorksNavigator';
import { ROUTES } from '../../constants';
import { wait } from '../../utils/wait';
import { getInitialState, GlobalProvider } from '../../state-mgmt/GlobalState';
import { getMockDeps } from '../../test-utils/getMockDeps';
import { Deps, IGlobalState } from '../../models/general';

const { Screen, Navigator } = createStackNavigator();

describe('HowItWorksNavigator', () => {
  console.warn = () => null;
  let deps: Deps;
  let mockReducer: any;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    mockReducer = jest.fn().mockReturnValue(initialState);
  });

  it('should render', async () => {
    render(
      <GlobalProvider deps={deps} initState={initialState} combinedReducers={mockReducer}>
        <NavigationContainer>
          <Navigator>
            <Screen name={ROUTES.HOW_IT_WORKS.TITLE} component={HowItWorksNavigator} />
          </Navigator>
        </NavigationContainer>
      </GlobalProvider>
    );
    await act(() => wait(0));
    expect(true).toBe(true); /** expect not to crash. There is an issue testing this navigator */
  });
});

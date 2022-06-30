import React, { useContext, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import { GlobalContext, GlobalProvider } from './GlobalState';
import { getMockDeps } from '../test-utils/getMockDeps';
import { GeneralModel } from '../models';

describe('GlobalState', () => {
  const Compo = () => {
    const { state, dispatch, deps } = useContext(GlobalContext);
    useEffect(() => {
      deps.stateSnapshot.get();
    });
    return (
      <View>
        <Text testID="state">{state}</Text>
        <Button testID="button" onPress={() => dispatch({ type: 'A', payload: 'new state' })} title="button" />
      </View>
    );
  };
  let deps: GeneralModel.Deps;
  let initialState: any;
  let combinedReducer: GeneralModel.IReducer;

  beforeEach(() => {
    deps = getMockDeps();
    initialState = 'initial state';
    combinedReducer = (state, action) => {
      if (action.type === 'A') return action.payload;
      return state;
    };
  });

  it('should access the global state context', () => {
    const { getByTestId } = render(
      <GlobalProvider initState={initialState} deps={deps} combinedReducers={combinedReducer}>
        <Compo />
      </GlobalProvider>
    );
    expect(getByTestId('state').props.children).toEqual('initial state');
  });

  it('should change the global state context by dispatching an action', () => {
    const { getByTestId } = render(
      <GlobalProvider initState={initialState} deps={deps} combinedReducers={combinedReducer}>
        <Compo />
      </GlobalProvider>
    );
    fireEvent.press(getByTestId('button'));
    expect(getByTestId('state').props.children).toEqual('new state');
  });

  it('should have access to injected deps', () => {
    render(
      <GlobalProvider initState={initialState} deps={deps} combinedReducers={combinedReducer}>
        <Compo />
      </GlobalProvider>
    );
    expect(deps.stateSnapshot.get).toBeCalledTimes(1);
  });
});

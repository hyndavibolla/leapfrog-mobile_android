import React from 'react';
import { View } from 'react-native';
import { ViewHideWithTutorial } from '_commons/components/organisms/ViewHideWithTutorial';
import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

describe('ViewHideWithTutorial', () => {
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    jest.useFakeTimers();
  });
  it('should render with default values', () => {
    initialState.core.isTutorialVisible = true;
    const { getByTestId } = renderWithGlobalContext(
      <ViewHideWithTutorial>
        <View testID="child" />
      </ViewHideWithTutorial>,
      deps,
      initialState
    );
    jest.runAllTimers();
    expect(getByTestId('child')).toBeTruthy();
    expect(getByTestId('view-hide-tutorial-view')).toHaveStyle({ opacity: 0.25 });
  });

  it('should render with tutorial in false', () => {
    initialState.core.isTutorialVisible = false;
    const { getByTestId } = renderWithGlobalContext(
      <ViewHideWithTutorial>
        <View testID="child" />
      </ViewHideWithTutorial>,
      deps,
      initialState
    );
    expect(getByTestId('child')).toBeTruthy();
    expect(getByTestId('view-hide-tutorial-view')).toHaveStyle({ opacity: undefined });
  });
});

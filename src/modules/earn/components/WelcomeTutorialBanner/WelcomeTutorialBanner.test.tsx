import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';

import WelcomeTutorialBanner, { Props } from './WelcomeTutorialBanner';

describe('WelcomeTutorialBanner', () => {
  let initialState: IGlobalState;
  let deps: Deps;
  let props: Props;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    props = {
      onSkipPress: jest.fn(),
      onWatchPress: jest.fn()
    };
  });

  it('should render with firstName', () => {
    initialState.user.currentUser.firstName = 'name';
    const { getByTestId } = renderWithGlobalContext(<WelcomeTutorialBanner {...props} />, deps, initialState);
    expect(getByTestId('welcome-tutorial-banner-title').props.children).toEqual(`Welcome, ${initialState.user.currentUser.firstName}!`);
  });

  it('should render with firstName undefined', () => {
    initialState.user.currentUser.firstName = undefined;
    const { getByTestId } = renderWithGlobalContext(<WelcomeTutorialBanner {...props} />, deps, initialState);
    expect(getByTestId('welcome-tutorial-banner-title').props.children).toEqual('Welcome!');
  });

  it('should call skip button', () => {
    initialState.user.currentUser.firstName = undefined;
    const { getByTestId } = renderWithGlobalContext(<WelcomeTutorialBanner {...props} />, deps, initialState);
    fireEvent.press(getByTestId('welcome-tutorial-banner-skip-button'));
    expect(props.onSkipPress).toBeCalled();
  });

  it('should call confirm button', () => {
    initialState.user.currentUser.firstName = undefined;
    const { getByTestId } = renderWithGlobalContext(<WelcomeTutorialBanner {...props} />, deps, initialState);
    fireEvent.press(getByTestId('welcome-tutorial-banner-confirm-button'));
    expect(props.onWatchPress).toBeCalled();
  });
});

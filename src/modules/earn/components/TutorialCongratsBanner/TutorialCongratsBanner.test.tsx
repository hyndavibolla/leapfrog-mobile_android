import React from 'react';
import { Animated, FlatList } from 'react-native';

import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';
import TutorialCongratsBanner, { Props } from './TutorialCongratsBanner';

jest.useFakeTimers('legacy');
jest.spyOn(global, 'setTimeout');

describe('TutorialCongratsBanner', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    deps = getMockDeps();
    initialState = getInitialState();
    props = {
      fromSkipTutorial: false
    };
    jest.spyOn(Animated, 'FlatList' as any, 'get').mockReturnValue(FlatList);
  });

  it('should render', () => {
    const { getByTestId, queryAllByTestId, toJSON } = renderWithGlobalContext(<TutorialCongratsBanner {...props} />, deps, initialState);
    expect(getByTestId('tutorial-congrats-banner-container')).toBeTruthy();
    expect(queryAllByTestId('tutorial-congrats-banner-item').length).toBe(2);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render first item with firstName', () => {
    initialState.user.currentUser.firstName = 'name';
    const { queryAllByTestId } = renderWithGlobalContext(<TutorialCongratsBanner {...props} />, deps, initialState);
    expect(queryAllByTestId('tutorial-congrats-banner-item-text')[0].props.children).toEqual(`Here we go, ${initialState.user.currentUser.firstName}!`);
  });

  it('should render first item without firstName (fallback)', () => {
    initialState.user.currentUser.firstName = undefined;
    const { queryAllByTestId } = renderWithGlobalContext(<TutorialCongratsBanner {...props} />, deps, initialState);
    expect(queryAllByTestId('tutorial-congrats-banner-item-text')[0].props.children).toContain('Here we go!');
  });

  it('should render only second item if fromSkipTutorial is true', () => {
    props.fromSkipTutorial = true;
    const { queryAllByTestId, toJSON } = renderWithGlobalContext(<TutorialCongratsBanner {...props} />, deps, initialState);
    expect(queryAllByTestId('tutorial-congrats-banner-item').length).toBe(1);
    jest.runOnlyPendingTimers();
    expect(toJSON()).toMatchSnapshot();
  });
});

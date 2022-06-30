import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { getMockDeps } from '_test_utils/getMockDeps';
import { Deps, IGlobalState } from '_models/general';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getInitialState } from '_state_mgmt/GlobalState';
import SYWLogo from '_assets/shared/sywLogo.svg';
import { ROUTES } from '_constants/routes';

import Header, { Props } from './Header';
import { styles } from './styles';

describe('Header', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    deps = getMockDeps();
    initialState = getInitialState();
    props = {
      navigation: { navigate: jest.fn() } as any,
      logo: <SYWLogo />,
      onPointsPress: jest.fn(),
      onProfilePress: jest.fn(),
      userPoints: 25,
      avatarUrl: 'avatar.url.com'
    };
  });

  it('should render Default Header', async () => {
    const { getByTestId } = renderWithGlobalContext(<Header {...props} />, deps, initialState);
    expect(getByTestId('header-container')).toBeTruthy();
  });

  it('should render without userPoints', () => {
    props.userPoints = undefined;
    initialState.game.current.balance.availablePoints = 20;
    const { getByTestId } = renderWithGlobalContext(<Header {...props} />, deps);
    expect(getByTestId('header-container')).toBeTruthy();
  });

  it('should render without userPoints and without availablePoints', () => {
    props.userPoints = undefined;
    initialState.game.current.balance.availablePoints = undefined;
    const { getByTestId } = renderWithGlobalContext(<Header {...props} />, deps, initialState);
    expect(getByTestId('header-container')).toBeTruthy();
  });

  it('should hide itself by adding a opacity of 0 if tutorial is active', () => {
    initialState.core.isTutorialVisible = true;
    const { getByTestId } = renderWithGlobalContext(<Header {...props} />, deps, initialState);
    expect(getByTestId('header-logo')).toHaveStyle(styles.tutorialVisible);
  });

  it('should render without onPointsPress', () => {
    props.onPointsPress = undefined;
    initialState.game.current.balance.availablePoints = undefined;
    const { getByTestId } = renderWithGlobalContext(<Header {...props} />, deps, initialState);
    fireEvent.press(getByTestId('header-points-btn'));
    expect(props.navigation.navigate).toHaveBeenCalledWith(ROUTES.POINT_HISTORY);
  });

  it('should render without onProfilePress', () => {
    props.onProfilePress = undefined;
    initialState.game.current.balance.availablePoints = undefined;
    const { getByTestId } = renderWithGlobalContext(<Header {...props} />, deps, initialState);
    fireEvent.press(getByTestId('header-profile-btn'));
    expect(props.navigation.navigate).toHaveBeenCalledWith(ROUTES.PROFILE, expect.any(Object));
  });
});

import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { CardLink, Props } from './CardLink';

import { Deps, IGlobalState } from '_models/general';
import { Provider } from '_models/mission';
import { getInitialState } from '_state_mgmt/GlobalState';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';

import { getMission_1 } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { reducer } from '_state_mgmt/cardLink/reducer';
import { initialState as cardLinkState } from '_state_mgmt/cardLink/state';
import { actions } from '_state_mgmt/cardLink/actions';

describe('CardLink WebViewer', () => {
  let deps: Deps;
  let props: Props;
  let state: IGlobalState;

  beforeEach(() => {
    const initialStateGetter = () => {
      const initialState = getInitialState();
      initialState.mission.missionSearchMap[KnownMissionSearchKey.EXCEPTIONAL] = ['cardlink-mission'];
      initialState.mission.missionMap['cardlink-mission'] = { ...getMission_1(), provider: Provider.CARDLINK };
      return initialState;
    };

    deps = getMockDeps(initialStateGetter);
    props = {
      navigation: { goBack: jest.fn() } as any,
      route: { params: {} }
    };
    state = initialStateGetter();
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<CardLink {...props} />, deps, state);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should navigate back if url is not found', () => {
    state.mission.missionMap = {};
    renderWithGlobalContext(<CardLink {...props} />, deps, state);

    expect(props.navigation.goBack).toBeCalled();
  });

  it('should navigate back if the webView navigates to a specific finishing URL', async () => {
    deps.apiService.fetchLinkedCardsList = jest.fn();
    const { getByTestId } = renderWithGlobalContext(<CardLink {...props} />, deps, state);
    const nativeEvent = { url: 'https://www.shopyourway.com/' };
    fireEvent(getByTestId('cardlink-webview'), 'onNavigationStateChange', nativeEvent);
    await waitFor(() => {
      expect(deps.apiService.fetchLinkedCardsList).toBeCalled();
      expect(props.navigation.goBack).toBeCalled();
    });
  });

  it('should NOT navigate back if the webView navigates to a non-recognized URL', () => {
    deps.apiService.fetchLinkedCardsList = jest.fn();
    const { queryByTestId } = renderWithGlobalContext(<CardLink {...props} />, deps, state);
    const nativeEvent = { url: 'https://www.google.com/' };
    fireEvent(queryByTestId('cardlink-webview'), 'onNavigationStateChange', nativeEvent);
    expect(deps.apiService.fetchLinkedCardsList).not.toBeCalled();
    expect(props.navigation.goBack).not.toBeCalled();
  });

  it('should show a critical error when an onHttpError is fired', () => {
    const { queryByTestId } = renderWithGlobalContext(<CardLink {...props} />, deps, state);
    expect(queryByTestId('critical-error-container')).toBeFalsy();
    fireEvent(queryByTestId('cardlink-webview'), 'onHttpError', { nativeEvent: { code: 401 } });
    expect(queryByTestId('critical-error-container')).toBeTruthy();
  });

  it('should render with param shouldActivateOffer and call setRouteToActivateLocalOffer', async () => {
    deps.apiService.fetchLinkedCardsList = jest.fn();
    state.core.routeHistory = ['route1', 'route2'];
    props.route.params.shouldActivateOffer = true;
    const { getByTestId } = renderWithGlobalContext(<CardLink {...props} />, deps, state);
    const nativeEvent = { url: 'https://www.shopyourway.com/' };
    fireEvent(getByTestId('cardlink-webview'), 'onNavigationStateChange', nativeEvent);

    await waitFor(() => {
      expect(reducer({ ...cardLinkState }, actions.setRouteToActivateLocalOffer(state.core.routeHistory[1]))).toEqual({
        ...cardLinkState,
        routeToActivateLocalOffer: state.core.routeHistory[1]
      });
      expect(props.navigation.goBack).toBeCalled();
    });
  });
});

import React from 'react';
import { act } from 'react-test-renderer';

import { FusionViewer, Props } from './FusionViewer';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';
import { getMockDeps } from '_test_utils/getMockDeps';
import { Deps } from '_models/general';
import { ROUTES, TealiumEventType, PageNames } from '_constants';
import { getInitialState } from '_state_mgmt/GlobalState';

describe('FusionViewer', () => {
  let props: Props;
  let deps: Deps;
  let onNavigationStateChange: () => void;

  beforeEach(() => {
    onNavigationStateChange = jest.fn();

    const initialStateGetter = () => {
      const initialState = getInitialState();
      initialState.core.lastRouteKey = ROUTES.MAIN_TAB.WALLET;
      initialState.user.currentUser.sywUserId = '123456';
      initialState.user.currentUser.personal.sywMemberNumber = '1234567890123456';
      return initialState;
    };

    deps = getMockDeps(initialStateGetter);
    deps.nativeHelperService.platform.OS = 'android';

    props = {
      navigation: { navigate: jest.fn() } as any
    };
  });

  it('should render', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ sid: 'sid', inactiveDate: null });
    const { toJSON } = renderWithGlobalContext(<FusionViewer {...props} />, deps);
    await act(async () => await wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should register fusion integration when intercepting matching url with result code', async () => {
    const { getByTestId } = renderWithGlobalContext(<FusionViewer {...props} />, deps);
    const resultCode = 'N';
    const eventData = { url: `https://sandbox.shopyourway.com/?fromCiti=${resultCode}` };
    await act(async () => await wait(0));
    expect(onNavigationStateChange).not.toBeCalled();
    await act(async () => getByTestId('fusion-viewer-webview').props.onNavigationStateChange(eventData));
    expect(props.navigation.navigate).toBeCalledWith(expect.any(String));
  });

  it('should register fusion integration when intercepting matching url without a result code', async () => {
    const { getByTestId } = renderWithGlobalContext(<FusionViewer {...props} />, deps);
    const resultCode = '';
    const eventData = { url: `https://sandbox.shopyourway.com/?fromCiti=${resultCode}` };
    await act(async () => await wait(0));
    expect(onNavigationStateChange).not.toBeCalled();
    await act(async () => getByTestId('fusion-viewer-webview').props.onNavigationStateChange(eventData));
    expect(props.navigation.navigate).toBeCalledWith(expect.any(String));
  });

  it('should not register fusion integration when intercepting invalid urls', async () => {
    const { getByTestId } = renderWithGlobalContext(<FusionViewer {...props} />, deps);
    const eventData = { url: 'invalid-url' };
    await act(async () => await wait(0));
    expect(onNavigationStateChange).not.toBeCalled();
    await act(async () => getByTestId('fusion-viewer-webview').props.onNavigationStateChange(eventData));
    expect(props.navigation.navigate).not.toBeCalledWith(expect.any(String));
  });

  it('should not register fusion integration when intercepting non-matching URLs', async () => {
    const { getByTestId } = renderWithGlobalContext(<FusionViewer {...props} />, deps);
    const eventData = { url: 'https://sandbox.shopyourway.com/mp/app/21686/l/card' };
    await act(async () => await wait(0));
    expect(onNavigationStateChange).not.toBeCalled();
    await act(async () => getByTestId('fusion-viewer-webview').props.onNavigationStateChange(eventData));
    expect(props.navigation.navigate).not.toBeCalledWith(expect.any(String));
  });

  it('should register fusion integration when intercepting matching url with a result code and a specific route', async () => {
    const route = { params: { routeToReturn: ROUTES.MAIN_TAB.WALLET } };
    const { getByTestId } = renderWithGlobalContext(<FusionViewer {...props} route={route} />, deps);
    const resultCode = 'N';
    const eventData = { url: `https://sandbox.shopyourway.com/?fromCiti=${resultCode}` };
    await act(async () => await wait(0));
    await act(async () => getByTestId('fusion-viewer-webview').props.onNavigationStateChange(eventData));
    expect(props.navigation.navigate).toBeCalledWith(expect.any(String), { finishedURI: true });
  });

  it('should track the application completion event', async () => {
    const { getByTestId } = renderWithGlobalContext(<FusionViewer {...props} />, deps);
    const resultCode = 'N';
    const eventData = { url: `https://sandbox.shopyourway.com/?fromCiti=${resultCode}` };
    await act(async () => await wait(0));
    await act(async () => getByTestId('fusion-viewer-webview').props.onNavigationStateChange(eventData));

    expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith(TealiumEventType.CARD_APPLICATION_COMPLETE, {
      '5321_cardmember': 'no',
      address: 'test://wallet',
      app_name: 'native',
      brand_category: undefined,
      brand_id: undefined,
      brand_name: undefined,
      error: undefined,
      event_detail: undefined,
      event_name: 'card application complete',
      event_type: 'N',
      exit_link: undefined,
      iframe: `https://sandbox.shopyourway.com/?fromCiti=${resultCode}`,
      instance: 'sywmax',
      login_state: 'authenticated',
      marketing_id: undefined,
      member_level: undefined,
      page_name: PageNames.MAIN.WALLET,
      page_type: 'top-level-screen',
      push_trigger: undefined,
      search_term: undefined,
      section: 'wallet',
      select_category: undefined,
      sort_by: undefined,
      syw_id: '123456',
      tid: '1234567890123456',
      touchpoint: 'android',
      user_type: undefined,
      uxObject: undefined
    });
  });
});

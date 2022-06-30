import React from 'react';
import { act } from 'react-test-renderer';

import RewardCheckout, { Props } from './RewardCheckout';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getSlideBrand_1 } from '_test_utils/entities';
import { wait } from '_utils/wait';
import { getMockDeps } from '_test_utils/getMockDeps';
import { Deps, IGlobalState, ITokenSet } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';

import { ENV, ROUTES } from '_constants';

describe('RewardCheckout', () => {
  let props: Props;
  let deps: Deps;
  let state: IGlobalState;

  beforeEach(() => {
    props = {
      route: {
        params: {
          brandId: getSlideBrand_1().id,
          cardValue: 500,
          brandLogo: 'brand logo',
          brandName: 'brand name',
          points: 500000
        }
      },
      navigation: { navigate: jest.fn() } as any
    };
    deps = getMockDeps();
    state = getInitialState();
  });

  it('should render', async () => {
    state.core.roToken = 'roToken';
    const tokenSet: ITokenSet = { accessToken: 'access', refreshToken: 'refresh', accessTokenExpiryTime: 'date', sywToken: 'sywToken' };
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(tokenSet);
    Date.now = () => 1980;
    const { toJSON } = renderWithGlobalContext(<RewardCheckout {...props} />, deps, state);
    await act(async () => await wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not navigate to rewards when intercept a not proper url', async () => {
    const { getByTestId } = renderWithGlobalContext(<RewardCheckout {...props} />, deps);
    const eventData = { url: 'https://www.notSlideUrl.com/giftcards' };
    await act(async () => await wait(0));
    await act(async () => getByTestId('slide-viewer-webview').props.onNavigationStateChange(eventData));
    expect(props.navigation.navigate).not.toBeCalled();
  });

  const slidePrefixes = ENV.API.SLIDE.FINISHED_URI_PREFIXES.split('|');
  slidePrefixes.forEach(slideUriPrefix => {
    it(`should navigate to rewards when intercept proper url (${slideUriPrefix})`, async () => {
      const { getByTestId } = renderWithGlobalContext(<RewardCheckout {...props} />, deps);
      const eventData = { url: slideUriPrefix };
      await act(async () => await wait(0));
      await act(async () => getByTestId('slide-viewer-webview').props.onNavigationStateChange(eventData));
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.MAIN_TAB.REWARDS);
    });
  });

  it('should redirect to checkout', async () => {
    deps.apiService.getTokenSetAsync = jest.fn().mockResolvedValue('token');
    const checkoutURL = `${ENV.API.SLIDE.CHECKOUT_BASE_URL}/order/?intcmp=iMAXxRewards&refid=test-ref-id&merchant=${ENV.MERCHANT}&itemId=754338d5-7c5e-4785-bd05-67cd46545df9&itemName=brand%20name&price=500&unit=cent&qty=1&imageUrl=brand%20logo&ffmType=Digital%20Delivery&points=500000`;
    const { getByTestId } = renderWithGlobalContext(<RewardCheckout {...props} />, deps);
    const eventData = { url: 'https://auth0api-sandbox.shopyourway.com/loginresume' };
    await act(async () => await wait(0));
    await act(async () => getByTestId('slide-viewer-webview').props.onNavigationStateChange(eventData));
    expect(props.navigation.navigate).not.toBeCalled();
    expect(getByTestId('slide-viewer-webview').props.source.uri).toEqual(checkoutURL);
  });

  it('should force to logout', async () => {
    const { getByTestId } = renderWithGlobalContext(<RewardCheckout {...props} />, deps);
    const eventData = { url: 'https://auth0api-sandbox.shopyourway.com/blocked' };
    await act(async () => await wait(0));
    await act(async () => getByTestId('slide-viewer-webview').props.onNavigationStateChange(eventData));
    expect(props.navigation.navigate).not.toBeCalled();
    expect(deps.nativeHelperService.storage.set).toHaveBeenCalledWith(ENV.STORAGE_KEY.FORCED_TO_LOGOUT, true);
  });
});

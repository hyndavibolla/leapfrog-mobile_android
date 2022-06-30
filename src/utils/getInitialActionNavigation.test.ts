import { CommonActions } from '@react-navigation/native';
import { ENV } from '_constants/env';
import { ROUTES } from '_constants/routes';
import getInitialActionNavigation from './getInitialActionNavigation';

describe('getInitialActionNavigation', () => {
  const route = ROUTES.TOOLTIP.REWARDS;
  const splittedRoute = route.split('/');
  const params = { step: '1' };
  const initialUrl = `${ENV.SCHEME}${route}?step=1`;
  const deepLink = { route, params };

  it('should return force update modal screen if value is true', () => {
    expect(getInitialActionNavigation(true, true, true, { initialUrl })).toEqual({
      action: CommonActions.navigate(ROUTES.FORCED_UPDATE_MODAL, {}),
      route: ROUTES.FORCED_UPDATE_MODAL,
      params: {}
    });
  });

  it('should return initial url if deep link data is not provided, user is logged in and force update is false. It should be a navigate if it is Earn Main or a public route.', () => {
    const expectedRoute = ROUTES.MAIN;
    const expectedParams = {
      screen: ROUTES.MAIN_TAB.MAIN,
      params: {
        screen: ROUTES.MAIN_TAB.EARN
      }
    };
    expect(getInitialActionNavigation(true, false, false, { initialUrl: `${ENV.SCHEME}${ROUTES.MAIN}/${ROUTES.MAIN_TAB.EARN}` })).toEqual({
      action: CommonActions.navigate(expectedRoute, expectedParams),
      route: expectedRoute,
      params: expectedParams
    });
  });

  it('should return initial url if deep link data is not provided, user is logged in and force update is false. It should be a reset if it is not Earn Main or a public route.', () => {
    const expectedRoute = splittedRoute[0];
    const expectedParams = {
      ...params,
      screen: splittedRoute[1]
    };
    expect(getInitialActionNavigation(true, false, false, { initialUrl })).toEqual({
      action: CommonActions.reset({
        index: 1,
        routes: [{ name: ROUTES.MAIN }, { name: expectedRoute, params: expectedParams }]
      }),
      route: expectedRoute,
      params: expectedParams
    });
  });

  it('should return deep link route if provided, user is logged in and force update is false. It should be a reset if it is not Earn Main or a public route.', () => {
    expect(getInitialActionNavigation(true, false, false, { initialUrl, deepLink })).toEqual({
      action: CommonActions.reset({
        index: 1,
        routes: [{ name: ROUTES.MAIN }, { name: deepLink.route, params: deepLink.params }]
      }),
      ...deepLink
    });
  });

  it('should autocomplete main for deep link if route is from main tab, user is logged in and force update is false.', () => {
    const expectedRoute = ROUTES.MAIN;
    const expectedParams = {
      screen: ROUTES.MAIN_TAB.MAIN,
      params: {
        screen: ROUTES.MAIN_TAB.REWARDS
      }
    };
    expect(getInitialActionNavigation(true, false, false, { initialUrl, deepLink: { route: ROUTES.MAIN_TAB.REWARDS, params: {} } })).toEqual({
      action: CommonActions.navigate(expectedRoute, expectedParams),
      route: expectedRoute,
      params: expectedParams
    });
  });

  it('should not return deep link route if route is unrecognized, user is logged in and force update is false.', () => {
    expect(getInitialActionNavigation(true, false, false, { initialUrl, deepLink: { ...deepLink, route: 'unrecognized' } })).toEqual({
      action: CommonActions.navigate(ROUTES.MAIN, {}),
      route: ROUTES.MAIN,
      params: {}
    });
  });

  it('should return login route if user is not logged in, force update is false and onboarding was seen', () => {
    expect(getInitialActionNavigation(false, true, false, { initialUrl: `${ENV.SCHEME}${ROUTES.MAIN_TAB.EARN}` })).toEqual({
      action: CommonActions.navigate(ROUTES.LOGIN, {}),
      route: ROUTES.LOGIN,
      params: {}
    });
  });

  it('should return onboarding route if user is not logged in, force update is false and onboarding was not seen', () => {
    expect(getInitialActionNavigation(false, false, false, { initialUrl: `${ENV.SCHEME}${ROUTES.MAIN_TAB.EARN}` })).toEqual({
      action: CommonActions.navigate(ROUTES.TOOLTIP.ONBOARDING, {}),
      route: ROUTES.TOOLTIP.ONBOARDING,
      params: {}
    });
  });

  it('should created nested params if it is a composed url', () => {
    const expectedRoute = ROUTES.POINT_HISTORY;
    const subRoute = 'sub-route';
    const anotherSubRoute = 'another-route';
    const expectedParams = {
      screen: subRoute,
      params: {
        screen: anotherSubRoute
      }
    };
    expect(getInitialActionNavigation(true, false, false, { initialUrl: `${ENV.SCHEME}${expectedRoute}/${subRoute}/${anotherSubRoute}` })).toEqual({
      action: CommonActions.reset({
        index: 1,
        routes: [{ name: ROUTES.MAIN }, { name: expectedRoute, params: expectedParams }]
      }),
      route: expectedRoute,
      params: expectedParams
    });
  });
});

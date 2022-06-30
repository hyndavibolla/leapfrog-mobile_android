import { CommonActions } from '@react-navigation/native';

import { ROUTES } from '_constants/routes';
import { getRouterDataFromLink } from '_utils/getRouterDataFromLink';
import { isMainTabRoute, routesContain } from '_utils/routeUtils';

const publicRoutes = [ROUTES.FORCED_UPDATE_MODAL, ROUTES.TOOLTIP.ONBOARDING];

const getInitialActionNavigation = (
  loggedIn: boolean,
  hasSeenOnboarding: boolean,
  showForcedUpdateScreen: boolean,
  initialData: { initialUrl?: string; deepLink?: { route: string; params: Object } }
) => {
  let route;
  let params = {};
  let action: CommonActions.Action;
  if (showForcedUpdateScreen) {
    route = ROUTES.FORCED_UPDATE_MODAL;
  } else {
    if (initialData.deepLink) {
      // Get data from Deep Link
      if (routesContain(initialData.deepLink.route)) {
        route = initialData.deepLink.route;
        params = initialData.deepLink.params;
        if (isMainTabRoute(route)) {
          params = {
            ...params,
            screen: ROUTES.MAIN_TAB.MAIN,
            params: {
              screen: route
            }
          };
          route = ROUTES.MAIN;
        }
      }
    } else if (initialData.initialUrl) {
      // Get data from Initial URL
      const { initialRouteRoot, nestedRoutes, queryParams } = getRouterDataFromLink(initialData.initialUrl);
      if (nestedRoutes.length >= 1 && isMainTabRoute(nestedRoutes[0])) {
        params = {
          ...queryParams,
          screen: ROUTES.MAIN_TAB.MAIN,
          params: {
            screen: nestedRoutes[0]
          }
        };
        route = ROUTES.MAIN;
      } else {
        const screenParams = nestedRoutes.reduce((previousValue, currentValue, currentIndex) => {
          if (currentIndex === 0) return { screen: currentValue };
          return {
            ...previousValue,
            params: {
              screen: currentValue
            }
          };
        }, {});
        if (routesContain(initialRouteRoot)) {
          route = initialRouteRoot;
          params = {
            ...queryParams,
            ...screenParams
          };
        }
      }
    }
  }
  // If is still empty, set Earn Main
  if (!route) route = ROUTES.MAIN;
  // Check if URL is public or user is not logged in
  const allowRedirect = publicRoutes.includes(route) || loggedIn;
  if (!allowRedirect) {
    route = hasSeenOnboarding ? ROUTES.LOGIN : ROUTES.TOOLTIP.ONBOARDING;
    params = {};
  }
  action = CommonActions.navigate(route, params);
  const isEarnMain = route === ROUTES.MAIN;
  if (allowRedirect && !publicRoutes.includes(route) && (!isEarnMain || (params as any).offer)) {
    // Creates an different action if it is a route that should go back
    action = CommonActions.reset({
      index: 1,
      routes: [{ name: ROUTES.MAIN }, { name: route, params }]
    });
  }
  return { action, route, params };
};

export default getInitialActionNavigation;

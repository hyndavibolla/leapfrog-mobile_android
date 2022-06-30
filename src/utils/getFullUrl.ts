import { ROUTES_PARAMS } from '../constants/routes';

export const getFullUrl = (routeName: string, routeParams: object) => {
  if (!routeParams) return routeName;
  const paramsArray = ROUTES_PARAMS[routeName] || [];
  const paramsUrl = paramsArray.reduce((url, param) => (routeParams[param] ? url + `/${routeParams[param]}` : ''), '');
  return routeName + paramsUrl;
};

import { ROUTES } from '../constants';

export const getRouterDataFromLink = (link: string): { initialRouteRoot: string; nestedRoutes: string[]; queryParams: Record<string, string> } => {
  const safeLink = link ? decodeURI(link) : ROUTES.MAIN;
  const [canonicalLink, rawQueryParams] = safeLink.split('?');
  const splittedRouted = canonicalLink.replace(/^.+:\/\//, '').split('/');
  const queryParams = !rawQueryParams ? {} : rawQueryParams.split('&').reduce((total, curr) => ({ ...total, [curr.split('=')[0]]: curr.split('=')[1] }), {});
  return { initialRouteRoot: splittedRouted[0], nestedRoutes: splittedRouted.slice(1), queryParams };
};

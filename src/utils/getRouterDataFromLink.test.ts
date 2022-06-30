import { ROUTES } from '_constants/routes';
import { getRouterDataFromLink } from './getRouterDataFromLink';

describe('getRouterDataFromLink', () => {
  it('should get router data from a link', () => {
    expect(getRouterDataFromLink('a/b')).toEqual({ initialRouteRoot: 'a', nestedRoutes: ['b'], queryParams: {} });
  });

  it('should get router data from a link with query params', () => {
    expect(getRouterDataFromLink('a?b=2&c=asd')).toEqual({ initialRouteRoot: 'a', nestedRoutes: [], queryParams: { b: '2', c: 'asd' } });
  });

  it('should get router data from a link with query params and nested routes', () => {
    expect(getRouterDataFromLink('a/b?b=2&c=asd')).toEqual({ initialRouteRoot: 'a', nestedRoutes: ['b'], queryParams: { b: '2', c: 'asd' } });
  });

  it('should get router data when link is missing', () => {
    expect(getRouterDataFromLink(undefined)).toEqual({ initialRouteRoot: ROUTES.MAIN, nestedRoutes: [], queryParams: {} });
  });
});

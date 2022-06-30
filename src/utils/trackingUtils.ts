import { PageByRoutes, PageParams } from '_constants';

export const getPageNameWithParams = (pageName: string, params?: string[]) => {
  if (!params?.length) return pageName;
  if (params.length !== PageParams[pageName]?.length) return pageName;
  const parsedPageName = PageParams[pageName].reduce(
    (polishedPage, currentFilter, index) => polishedPage.replace(`:${currentFilter}:`, params[index]),
    pageName
  );
  return parsedPageName;
};

export const getPageNameByRoute = (route: string) => {
  const pageNameByRoute = PageByRoutes[route];
  if (!pageNameByRoute) return route;
  return pageNameByRoute;
};

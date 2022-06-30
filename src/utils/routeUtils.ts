import { ROUTES } from '../constants';

const getValues = (obj: any): string[] => {
  return Object.getOwnPropertyNames(obj)
    .map(property => {
      const value = obj[property];
      if (typeof value === 'string') return [value];
      return getValues(value);
    })
    .reduce((a, c) => [...a, ...c], []); // flatten array of arrays
};

const mainTabValues = getValues(ROUTES.MAIN_TAB);
const routeValues = getValues(ROUTES);

export const isMainTabRoute = (routeName: string) => {
  return mainTabValues.includes(routeName);
};

export const routesContain = (routeName: string) => {
  return routeValues.includes(routeName);
};

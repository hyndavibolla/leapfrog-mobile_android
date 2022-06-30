import { ROUTES } from '../constants';
import { routesContain } from './routeUtils';

describe('routeUtils', () => {
  describe('routesContain', () => {
    it('returns true for existing routes', () => {
      // first-level
      expect(routesContain(ROUTES.LOGIN)).toBe(true);
      expect(routesContain(ROUTES.MAIN)).toBe(true);

      // nested ones
      expect(routesContain(ROUTES.HOW_IT_WORKS.TITLE)).toBe(true);
      expect(routesContain(ROUTES.DEV_TOOLS_TAB.STORAGE)).toBe(true);
    });

    it('returns false for non-existing routes', () => {
      expect(routesContain('any string')).toBe(false);

      // universal links or deep links
      expect(routesContain('https://syw-dev.onelink.me/70qH/EarnBrandCVS')).toBe(false);
      expect(routesContain('syw://main')).toBe(false);
      expect(routesContain('devsywmax://main')).toBe(false);
      expect(routesContain('test://main')).toBe(false);
    });
  });
});

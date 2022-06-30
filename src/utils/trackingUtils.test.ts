import { ROUTES, PageNames } from '../constants';
import { getPageNameByRoute, getPageNameWithParams } from './trackingUtils';

describe('trackingUtils', () => {
  describe('getPageNameByRoute', () => {
    const testingRoutes = [
      { route: ROUTES.TOOLTIP.MISSIONS_STEP_1, page: PageNames.TOOLTIP.MISSIONS_STEP_1 },
      { route: ROUTES.TOOLTIP.MISSIONS_STEP_2, page: PageNames.TOOLTIP.MISSIONS_STEP_2 },
      { route: ROUTES.TOOLTIP.MISSIONS_STEP_3, page: PageNames.TOOLTIP.MISSIONS_STEP_3 },
      { route: ROUTES.MAIN_TAB.STREAK, page: PageNames.MAIN.MISSIONS },
      { route: ROUTES.MAIN_TAB.EARN, page: PageNames.MAIN.EARN }
    ];
    it.each(testingRoutes)('should parse the route to page name', async ({ route, page }) => {
      expect(getPageNameByRoute(route)).toEqual(page);
    });
  });

  describe('getPageNameWithParams', () => {
    it('should return the page with params', () => {
      const pageName = PageNames.EARN.MISSION_SEE_ALL;
      const params = ['some params'];
      expect(getPageNameWithParams(pageName, params)).toEqual('Main > Earn > Search > some params > See All');
    });

    it('should return the same page without params', () => {
      const pageName = PageNames.MAIN.EARN;
      expect(getPageNameWithParams(pageName)).toEqual(pageName);
    });

    it('should return the same page with different params', () => {
      const pageName = PageNames.MAIN.EARN;
      const params = ['some params'];
      expect(getPageNameWithParams(pageName, params)).toEqual(pageName);
    });
  });
});

/* istanbul ignore file */
/** no need to test this dev only component */

import { ENV } from '../constants';
import { IApiOverrideRule } from '../models/general';
import { wait } from './wait';

export const fetchDevOverride = (() => {
  let mockList: IApiOverrideRule[] = null;
  return async (
    input: RequestInfo,
    init: RequestInit,
    storageGetter: (key: string) => Promise<IApiOverrideRule[]>,
    http: (input: any, init?: any) => Promise<Response>
  ): Promise<any> => {
    if (!mockList) mockList = (await storageGetter(ENV.STORAGE_KEY.API_OVERRIDE_SETTINGS)) || [];
    const mock = typeof input === 'string' && mockList.find(({ matcher }) => new RegExp(matcher, 'i').test(input));

    if (mock) {
      await wait(Math.random() * 1000);
      return { status: mock.status, json: async () => mock.response } as any;
    }
    return http(input, init);
  };
})();

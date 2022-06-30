import { HttpService } from './HttpService';
import { ENV } from '../constants';
import { FeatureFlag } from '../models/general';

describe('HttpService', () => {
  let storageGet: <T>(key: string) => Promise<T>;
  let fetchFromNetwork: (url: string, init: RequestInit) => Promise<Response>;

  beforeEach(() => {
    storageGet = jest.fn().mockResolvedValue([{ matcher: 'example', status: 200, response: {} }]);
    fetchFromNetwork = jest.fn().mockResolvedValue({ status: 200 });
  });

  const getHttpService = ({ fetch } = { fetch: fetchFromNetwork }) => new HttpService(storageGet, fetch);

  describe('fetch', () => {
    let ignoredFeatureFlags: FeatureFlag[];

    beforeAll(() => {
      ignoredFeatureFlags = ENV.IGNORED_FEATURE_LIST;
    });

    beforeEach(() => {
      ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
    });

    afterAll(() => {
      ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
    });

    it('uses local storage when feature flag enables it', async () => {
      ENV.IGNORED_FEATURE_LIST = ENV.IGNORED_FEATURE_LIST.filter(f => f !== FeatureFlag.API_OVERRIDE);
      const httpService = getHttpService();
      await httpService.fetch('https://fake.example.com', { method: 'GET' });
      expect(storageGet).toBeCalledWith(ENV.STORAGE_KEY.API_OVERRIDE_SETTINGS);
    });

    it('uses the network', async () => {
      const httpService = getHttpService();
      await httpService.fetch('https://fake.example.com', { method: 'GET' });

      expect(fetchFromNetwork).toBeCalledWith('https://fake.example.com', { method: 'GET' });
    });

    it('throws if the response does not have a success status', async () => {
      const fetch = jest.fn().mockResolvedValue({ status: 401 });
      const httpService = getHttpService({ fetch });

      // why toBeTruthy() instead of throws(): https://github.com/facebook/jest/issues/1700#issuecomment-377890222
      await expect(httpService.fetch('https://fake.example.com', { method: 'GET' })).rejects.toBeTruthy();
    });

    it('throws if the request throws', async () => {
      const fetch = jest.fn().mockRejectedValue('Error');
      const httpService = getHttpService({ fetch });

      // why toBeTruthy() instead of throws(): https://github.com/facebook/jest/issues/1700#issuecomment-377890222
      await expect(httpService.fetch('https://fake.example.com', { method: 'GET' })).rejects.toBeTruthy();
    });
  });
});

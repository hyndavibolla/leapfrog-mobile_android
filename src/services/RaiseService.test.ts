import { RaiseService } from './RaiseService';
import { HTTP_METHOD } from '../models/general';
import { ENV } from '../constants';
import { getMockDeps } from '../test-utils/getMockDeps';
import { IHttpService } from './HttpService';

describe('RaiseService', () => {
  let raiseService: RaiseService;
  let crashlyticsService: any;
  let httpService: IHttpService;
  let waitForConnection: any;
  let url: string;
  let payload: any;
  let logger: any;
  let sha256: any;

  beforeEach(() => {
    console.error = console.warn = () => null;
    url = 'url';
    payload = { a: 1, b: 2 };
    httpService = {
      fetch: jest.fn().mockResolvedValue({ status: 200, json: async () => ({ data: [] }) })
    };
    waitForConnection = Promise.resolve;
    logger = getMockDeps().logger;
    crashlyticsService = getMockDeps().crashlyticsService;
    sha256 = args => JSON.stringify(args);
    raiseService = new RaiseService(httpService, logger, crashlyticsService, waitForConnection, sha256);
  });

  it('should make a request', async () => {
    await (raiseService as any).request(url, payload);
    expect(httpService.fetch).toBeCalledWith(`${ENV.API.SLIDE.URL}/${url}?a=1&b=2`, {
      method: HTTP_METHOD.GET,
      payload: undefined,
      headers: {
        'X-Client': ENV.API.SLIDE.CLIENT_ID,
        'X-Timestamp': expect.any(Number),
        'X-Signature': expect.stringMatching(/^v1:/),
        BRANDS_VERSION: 'v2'
      }
    });
  });
});

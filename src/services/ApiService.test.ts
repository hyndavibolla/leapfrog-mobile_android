import { ENV } from '_constants';
import { HTTP_METHOD, ITokenSet } from '_models/general';
import { MissionListType } from '_models/mission';
import { ApiService, ZEROED_UUID } from '_services/ApiService';
import { AppService } from '_services/AppService';
import { ICrashlyticsService } from '_services/CrashlyticsService';
import { IHttpService } from '_services/HttpService';
import { LogMethod } from '_services/Logger';
import { getMockDeps } from '_test_utils/getMockDeps';
import { wait } from '_utils/wait';

function constructResponse(body: any, status: number = 200) {
  return {
    status,
    headers: {
      get: () => 'application/json'
    },
    json: () => Promise.resolve(body)
  };
}

describe('ApiService', () => {
  let appService: AppService;
  let apiService: ApiService;
  let httpService: IHttpService;
  let waitForConnection: any;
  let url: string;
  let payload: any;
  let persistTokenSet: any;
  let getTokenSet: any;
  let getDeviceId: any;
  let logger: any;
  let crashlyticsService: ICrashlyticsService;
  let authService: any;
  let getAdvertisingId: any;

  beforeEach(() => {
    console.error = console.warn = () => null;
    persistTokenSet = jest.fn();
    getTokenSet = jest.fn().mockResolvedValue(null);
    getDeviceId = jest.fn().mockResolvedValue(null);
    url = '/url';
    payload = { a: 1, b: 2 };
    httpService = {
      fetch: jest.fn().mockResolvedValue(constructResponse({ resultCode: 0, value: { a: 1 } }))
    };
    waitForConnection = Promise.resolve;
    logger = getMockDeps().logger;
    crashlyticsService = getMockDeps().crashlyticsService;
    authService = getMockDeps().authService;
    getAdvertisingId = jest.fn().mockResolvedValue(null);
    appService = new AppService(getDeviceId);
    apiService = new ApiService(
      appService,
      getAdvertisingId,
      httpService,
      logger,
      crashlyticsService,
      persistTokenSet,
      getTokenSet,
      waitForConnection,
      authService
    );
    (apiService as any).tokenSet = {
      accessToken: 'access',
      refreshToken: 'refresh',
      accessTokenExpiryTime: 'accessTokenExpiryTime',
      deviceId: 'deviceId',
      expiresIn: 10000
    };
  });

  afterEach(() => {
    apiService.clearIntervals();
  });

  it('should make a GET request', async () => {
    (apiService as any).request(url, payload);
    await wait(0);
    expect(httpService.fetch).toBeCalledWith(`${ENV.API.URL}${url}?a=1&b=2`, { method: HTTP_METHOD.GET, payload: undefined, headers: expect.any(Object) });
  });

  it('should make a POST request', async () => {
    (apiService as any).request(url, payload, HTTP_METHOD.POST);
    await wait(0);
    expect(httpService.fetch).toBeCalledWith(`${ENV.API.URL}${url}`, { method: HTTP_METHOD.POST, body: JSON.stringify(payload), headers: expect.any(Object) });
  });

  it('should make a PUT request', async () => {
    (apiService as any).request(url, payload, HTTP_METHOD.PUT);
    await wait(0);
    expect(httpService.fetch).toBeCalledWith(`${ENV.API.URL}${url}`, { method: HTTP_METHOD.PUT, body: JSON.stringify(payload), headers: expect.any(Object) });
  });

  it('should make a PATCH request', async () => {
    (apiService as any).request(url, payload, HTTP_METHOD.PATCH);
    await wait(0);
    expect(httpService.fetch).toBeCalledWith(`${ENV.API.URL}${url}`, { method: HTTP_METHOD.PATCH, body: JSON.stringify(payload), headers: expect.any(Object) });
  });

  it('should make a DELETE request', async () => {
    (apiService as any).request(url, payload, HTTP_METHOD.DELETE);
    await wait(0);
    expect(httpService.fetch).toBeCalledWith(`${ENV.API.URL}${url}`, { method: HTTP_METHOD.DELETE, body: undefined, headers: expect.any(Object) });
  });

  it('should wait for connection before fetching', async () => {
    const timeUntilConnectionIsRegained = 500;
    waitForConnection = () => wait(timeUntilConnectionIsRegained);
    apiService = new ApiService(
      appService,
      getAdvertisingId,
      httpService,
      logger,
      crashlyticsService,
      persistTokenSet,
      getTokenSet,
      waitForConnection,
      authService
    );
    (apiService as any).tokenSet = {
      accessToken: 'access',
      refreshToken: 'refresh',
      accessTokenExpiryTime: 'accessTokenExpiryTime',
      deviceId: 'deviceId',
      expiresIn: 10000
    };
    (apiService as any).request(url, payload);
    await wait(0);
    expect(httpService.fetch).not.toBeCalled();
    await wait(timeUntilConnectionIsRegained);
    expect(httpService.fetch).toBeCalled();
  });

  it('should set a token set', async () => {
    const tokenSet = { accessToken: 'access', refreshToken: 'refresh', accessTokenExpiryTime: 'accessTokenExpiryTime' } as ITokenSet;
    const deviceId = 'deviceId';
    apiService = new ApiService(
      appService,
      getAdvertisingId,
      httpService,
      logger,
      crashlyticsService,
      persistTokenSet,
      getTokenSet,
      waitForConnection,
      authService
    );
    expect((apiService as any).tokenSet).toBeFalsy();
    await apiService.setTokenSet(tokenSet, deviceId);
    expect(persistTokenSet).toBeCalledWith(tokenSet);
    expect((apiService as any).tokenSet).toEqual(tokenSet);
    expect((apiService as any).deviceId).toEqual(deviceId);
  });

  it('should not allow invalid token sets to be set', async () => {
    // the expiry time will force a call to refreshToken
    const tokenSet = { accessToken: 'testToken', refreshToken: '', accessTokenExpiryTime: new Date(1980).toJSON() } as ITokenSet;
    const deviceId = 'deviceId';
    try {
      await apiService.setTokenSet(tokenSet, deviceId);
      expect(false).toBe(true);
    } catch {
      await apiService.fetchUserProfile();
      expect(logger.error).toHaveBeenCalledWith('Attempted to set an invalid tokenSet. Setting token as invalid', expect.anything());
    }
  });

  describe('shouldRefreshToken method', () => {
    it('should return false when token is not set', async () => {
      expect(await (apiService as any).shouldRefreshToken()).toBeFalsy();
    });

    it('should return false when token is still within the valid time window', async () => {
      const tokenSet = {
        accessToken: 'access',
        refreshToken: 'refresh',
        accessTokenExpiryTime: new Date(Date.now() + ENV.API.API_TOKEN_EXPIRATION_PADDING_MS * 2).toJSON()
      } as ITokenSet;
      const deviceId = 'deviceId';
      await apiService.setTokenSet(tokenSet, deviceId);
      expect(await (apiService as any).shouldRefreshToken()).toBeFalsy();
    });

    it('should return true when token is NOT within the valid time window', async () => {
      const tokenSet = {
        accessToken: 'access',
        refreshToken: 'refresh',
        accessTokenExpiryTime: new Date(Date.now() - ENV.API.API_TOKEN_EXPIRATION_PADDING_MS + 100).toJSON(),
        expiresIn: 1
      } as ITokenSet;
      const deviceId = 'deviceId';
      await apiService.setTokenSet(tokenSet, deviceId);
      expect(await (apiService as any).shouldRefreshToken()).toBeTruthy();
    });

    it('should return true when token is expired', async () => {
      const tokenSet = { accessToken: 'access', refreshToken: 'refresh', accessTokenExpiryTime: new Date(1980).toJSON(), expiresIn: 1 } as ITokenSet;
      const deviceId = 'deviceId';
      await apiService.setTokenSet(tokenSet, deviceId);
      expect(await (apiService as any).shouldRefreshToken()).toBeTruthy();
    });
  });

  describe('retry logic', () => {
    it('should NOT retry if the server responds with a status code that does NOT exist in the range of status codes that need retry', async () => {
      httpService = {
        fetch: jest.fn().mockResolvedValue(constructResponse({ resultCode: 0, value: { a: 1 } }))
      };
      apiService = new ApiService(
        appService,
        getAdvertisingId,
        httpService,
        logger,
        crashlyticsService,
        persistTokenSet,
        getTokenSet,
        waitForConnection,
        authService
      );
      (apiService as any).tokenSet = {
        accessToken: 'access',
        refreshToken: 'refresh',
        accessTokenExpiryTime: 'accessTokenExpiryTime',
        expiresIn: 'expiresIn',
        deviceId: 'deviceId'
      };
      await (apiService as any).request(url, payload);
      expect(httpService.fetch).toBeCalledTimes(1);
    });

    it(`should retry ${ENV.API.API_RETRY_REQUEST_ATTEMPTS} times if the server responds a status code that exists in the range of status codes that need retry`, async () => {
      httpService = {
        fetch: jest.fn().mockRejectedValue(constructResponse({ resultCode: 0, value: { a: 1 } }, 503))
      };
      apiService = new ApiService(
        appService,
        getAdvertisingId,
        httpService,
        logger,
        crashlyticsService,
        persistTokenSet,
        getTokenSet,
        waitForConnection,
        authService
      );
      (apiService as any).tokenSet = {
        accessToken: 'access',
        refreshToken: 'refresh',
        accessTokenExpiryTime: 'accessTokenExpiryTime',
        expiresIn: 'expiresIn',
        deviceId: 'deviceId'
      };
      try {
        await (apiService as any).request(url, payload);
      } catch {
        expect(httpService.fetch).toBeCalledTimes(ENV.API.API_RETRY_REQUEST_ATTEMPTS + 1); // add 1 for the first attempt
      }
    });
  });

  describe('logging and assertions', () => {
    beforeEach(() => {
      // getDeviceId returns undefined for this set of tests
      apiService = new ApiService(
        appService,
        getAdvertisingId,
        httpService,
        logger,
        crashlyticsService,
        persistTokenSet,
        getTokenSet,
        waitForConnection,
        authService
      );
    });

    describe('#registerDeviceInfo', () => {
      it('should warn of a request with no deviceId', async () => {
        try {
          getDeviceId.mockResolvedValue(undefined);
          await apiService.registerDeviceInfo('testDeviceToken', 'America/Chicago', '0.0.1', 'iPhone XS', 'en-US', 'iOS', '14.7', 'testFcmToken');
          expect(true).toBe(false);
        } catch {
          expect(logger.assert).toHaveBeenCalledWith(LogMethod.WARN, true, 'deviceId is falsy (undefined)');
        }
      });
    });

    describe('#fetchMissionList', () => {
      it('should call actual fetch endpoint with corresponding advertisingId', async () => {
        const advertisingId = 'weird_ADVERTISING-Id';
        getAdvertisingId.mockResolvedValue({ advertisingId });
        getTokenSet.mockResolvedValue({
          accessToken: 'access',
          refreshToken: 'refresh',
          accessTokenExpiryTime: 'expiry',
          expiresIn: 'expiresIn',
          sywToken: 'syw'
        });
        getDeviceId.mockResolvedValue('random-id');

        const listType = MissionListType.DEFAULT;
        await apiService.fetchMissionList({ listType });
        expect(httpService.fetch).toHaveBeenCalledWith(
          `https://not-a-real-url.net${apiService.urls.MISSION_LIST}?listType=${listType}&advertisingId=${advertisingId}`,
          expect.anything()
        );
      });
    });

    it('should pass a zeroed advertisingId if it fails to retrieve it', async () => {
      getAdvertisingId.mockRejectedValue();
      getTokenSet.mockResolvedValue({
        accessToken: 'access',
        refreshToken: 'refresh',
        accessTokenExpiryTime: 'expiry',
        expiresIn: 'expiresIn',
        sywToken: 'syw'
      });
      getDeviceId.mockResolvedValue('random-id');

      await apiService.fetchMissionList({ listType: MissionListType.DEFAULT });
      expect(httpService.fetch).toHaveBeenCalledWith(expect.stringContaining(`advertisingId=${ZEROED_UUID}`), expect.anything());
    });

    it('should pass a zeroed advertisingId if it comes back as empty', async () => {
      getAdvertisingId.mockResolvedValue('');
      getTokenSet.mockResolvedValue({
        accessToken: 'access',
        refreshToken: 'refresh',
        accessTokenExpiryTime: 'expiry',
        expiresIn: 'expiresIn',
        sywToken: 'syw'
      });
      getDeviceId.mockResolvedValue('random-id');

      await apiService.fetchMissionList({ listType: MissionListType.DEFAULT });
      expect(httpService.fetch).toHaveBeenCalledWith(expect.stringContaining(`advertisingId=${ZEROED_UUID}`), expect.anything());
    });

    describe('any other mobile backend request', () => {
      it('should warn of a request with no accessToken', async () => {
        const tokenSet = { accessToken: '', refreshToken: 'refresh', accessTokenExpiryTime: 'accessTokenExpiryTime', expiresIn: 123456789 } as ITokenSet;
        (apiService as any).tokenSet = tokenSet;
        (apiService as any).deviceId = 'deviceId';
        try {
          await apiService.fetchUserProfile();
          expect(false).toBe(true);
        } catch {
          expect(logger.assert).toHaveBeenCalledWith(LogMethod.WARN, true, 'accessToken is falsy ()', expect.anything());
        }
      });
    });
  });

  describe('#refreshToken', () => {
    it('should warn of no deviceId', async () => {
      // the expiry time will force a call to refreshToken
      const tokenSet = { accessToken: 'testToken', refreshToken: 'refresh', accessTokenExpiryTime: new Date(1980).toJSON(), expiresIn: 123456789 } as ITokenSet;
      (apiService as any).tokenSet = tokenSet;
      (apiService as any).deviceId = '';
      getDeviceId.mockResolvedValue('');

      try {
        await apiService.fetchUserProfile();
        expect(false).toBe(true);
      } catch {
        expect(logger.assert).toHaveBeenCalledWith(LogMethod.WARN, true, 'deviceId is falsy ()');
      }
    });
  });
});

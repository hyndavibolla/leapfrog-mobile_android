import { NativeHelperService } from './NativeHelperService';
import { wait } from '../utils/wait';
import { ENV } from '../constants';
import { RUNTIME_ENV } from '../models/general';

describe('NativeHelperService', () => {
  let nativeHelperService: NativeHelperService;
  let alertDep: any;
  let secureStorageDep: any;
  let dimensionsDep: any;
  let deviceInfoDep: any;
  let netInfoDep: any;
  let linkingDep: any;
  let localizationDep: any;
  let appStateDep: any;
  let unsubscribe: any;
  let nativeModulesDep: any;
  let platformDep: any;
  let messagingDep: any;
  let sha256Dep: any;
  let restartDep: any;
  let cookieManagerDep: any;
  let base64Dep: any;
  let firebaseAuthorizationStatusDep: any;
  let sailthruService: any;
  let reactNativePermission: any;
  let geolocation: any;
  let clipboard: any;

  const getNativeHelperService = () =>
    new NativeHelperService(
      alertDep,
      secureStorageDep,
      dimensionsDep,
      deviceInfoDep,
      netInfoDep,
      linkingDep,
      localizationDep,
      appStateDep,
      nativeModulesDep,
      platformDep,
      messagingDep,
      sha256Dep,
      restartDep,
      cookieManagerDep,
      base64Dep,
      firebaseAuthorizationStatusDep,
      sailthruService,
      reactNativePermission,
      geolocation,
      clipboard
    );

  beforeEach(() => {
    firebaseAuthorizationStatusDep = { AUTHORIZED: 'AUTHORIZED', PROVISIONAL: 'PROVISIONAL' };
    alertDep = { alert: jest.fn(), prompt: jest.fn(), currentState: 'active' };
    appStateDep = { addEventListener: jest.fn() };
    secureStorageDep = { get: jest.fn().mockResolvedValue(null), set: jest.fn().mockResolvedValue(null), remove: jest.fn().mockResolvedValue(null) };
    dimensionsDep = { get: jest.fn().mockReturnValue({ width: 750, height: 1000 }) };
    deviceInfoDep = {
      getDeviceId: () => 'deviceId',
      getUniqueId: () => 'deviceId',
      getDeviceToken: () => Promise.resolve('deviceToken'),
      getVersion: () => 'appVersion',
      getBuildNumber: () => 'buildNumber',
      getModel: () => 'model',
      getSystemVersion: () => 'deviceOsVersion'
    };
    localizationDep = { getTimeZone: () => 'testing-timezone', getLocales: () => [{ languageTag: 'language' }] };
    unsubscribe = jest.fn();
    netInfoDep = {
      fetch: jest.fn().mockResolvedValue({ isConnected: true }),
      addEventListener: (cb: any) => {
        cb({ isConnected: true });
        return unsubscribe;
      }
    };
    platformDep = {
      OS: 'ios',
      select: jest.fn()
    };
    sha256Dep = {
      sha256: jest.fn().mockResolvedValue('hash-result')
    };
    linkingDep = { openURL: jest.fn(), canOpenURL: jest.fn(), getInitialURL: jest.fn(), addEventListener: jest.fn() };
    nativeModulesDep = {
      ButtonIntegration: {
        configureSDK: jest.fn(),
        setIdentifier: jest.fn(),
        clearAllData: jest.fn(),
        purchaseRequest: jest.fn()
      },
      ProdChecker: {
        getRunningEnvironment: jest.fn().mockResolvedValue(RUNTIME_ENV.DEV_TEST)
      }
    };
    messagingDep = {
      getToken: async () => 'FCMToken',
      getAPNSToken: async () => 'APNSToken',
      requestPermission: jest.fn().mockResolvedValue(firebaseAuthorizationStatusDep.AUTHORIZED),
      onTokenRefresh: cb => cb('newToken'),
      hasPermission: jest.fn()
    };
    restartDep = { Restart: jest.fn() };
    nativeHelperService = getNativeHelperService();
    cookieManagerDep = {
      clearAll: jest.fn().mockResolvedValue(true)
    };
    base64Dep = {
      encode: jest.fn().mockReturnValue('encoded'),
      decode: jest.fn().mockReturnValue('decoded')
    };
  });

  describe('alert', () => {
    it('should alert', () => {
      const text = 'some alert';
      nativeHelperService.alert.alert(text, null, null, null);
      expect(alertDep.alert).toBeCalledWith(text, null, null, null);
    });

    it('should prompt', () => {
      const text = 'some alert';
      nativeHelperService.alert.prompt(text, null, null, null, null, null);
      expect(alertDep.prompt).toBeCalledWith(text, null, null, null, null, null);
    });
  });

  describe('secure storage', () => {
    let item: any;
    beforeEach(() => {
      item = { a: 1 };
    });
    it('should get an item', async () => {
      secureStorageDep.get = jest.fn().mockResolvedValue(JSON.stringify(item));
      const retrieved = await nativeHelperService.storage.get('key');
      expect(retrieved).toEqual(item);
      expect(secureStorageDep.get).toBeCalledWith('key');
    });

    it("should try to get an item and get null if it doesn't exist or fails", async () => {
      secureStorageDep.get = jest.fn().mockRejectedValue(new Error('ignored error'));
      const retrieved = await nativeHelperService.storage.get('key');
      expect(retrieved).toEqual(null);
      expect(secureStorageDep.get).toBeCalledWith('key');
    });

    it('should set an item', async () => {
      await nativeHelperService.storage.set('key', item);
      expect(secureStorageDep.set).toBeCalledWith('key', JSON.stringify(item), expect.any(Object));
    });

    it('should remove an item', async () => {
      const res = await nativeHelperService.storage.remove('key');
      expect(secureStorageDep.remove).toBeCalledWith('key');
      expect(res).toBe(true);
    });

    it('should fail to remove an item', async () => {
      secureStorageDep.remove = Promise.reject;
      const res = await nativeHelperService.storage.remove('key');
      expect(res).toBe(false);
    });
  });

  describe('dimensions', () => {
    it('should get window width', () => {
      expect(nativeHelperService.dimensions.getWindowWidth()).toEqual(750);
    });

    it('should get window height', () => {
      expect(nativeHelperService.dimensions.getWindowHeight()).toEqual(1000);
    });
  });

  describe('deviceInfo', () => {
    it('should get app version', () => {
      const result = nativeHelperService.deviceInfo.getAppVersion();
      expect(result).toEqual('appVersion.buildNumber');
    });

    it('should get device model', () => {
      const result = nativeHelperService.deviceInfo.getDeviceModel();
      expect(result).toEqual('model');
    });

    it('should get device os version', () => {
      const result = nativeHelperService.deviceInfo.getDeviceOsVersion();
      expect(result).toEqual('deviceOsVersion');
    });

    it('should get device language', () => {
      const result = nativeHelperService.deviceInfo.getDeviceLanguage();
      expect(result).toEqual('language');
    });

    it('should get os device type', async () => {
      const result = await nativeHelperService.deviceInfo.getDeviceOsType();
      expect(result).toEqual('iOS');
    });

    it('should return an empty string when os device type is not ios or android', async () => {
      platformDep = {
        OS: 'anything'
      };
      nativeHelperService = getNativeHelperService();
      const result = await nativeHelperService.deviceInfo.getDeviceOsType();
      expect(result).toEqual('');
    });

    it('should get FCM token', async () => {
      const result = await nativeHelperService.deviceInfo.getFCMTokenAsync();
      expect(result).toEqual('FCMToken');
    });

    it('should listen to FCM token refresh', async () => {
      const cb = jest.fn();
      nativeHelperService.deviceInfo.onFCMTokenRefresh(cb);
      await wait(0);
      expect(cb).toBeCalledWith('newToken');
    });

    it('should should return undefined when FCM token could not be get', async () => {
      messagingDep.getToken = Promise.reject;
      nativeHelperService = getNativeHelperService();
      const result1 = await nativeHelperService.deviceInfo.getFCMTokenAsync();
      expect(result1).toEqual(undefined);

      messagingDep = { ...messagingDep, requestPermission: async () => false };
      nativeHelperService = getNativeHelperService();
      const result2 = await nativeHelperService.deviceInfo.getFCMTokenAsync();
      expect(result2).toEqual(undefined);
    });

    it('should get device language when there is none set', () => {
      localizationDep.getLocales = () => [];
      nativeHelperService = getNativeHelperService();
      const result = nativeHelperService.deviceInfo.getDeviceLanguage();
      expect(result).toEqual(expect.any(String));
    });

    it('should get device token', async () => {
      const tokenId = await nativeHelperService.deviceInfo.getDeviceTokenAsync();
      expect(tokenId).toEqual('APNSToken');
    });

    it('should return an empty string when device token is undefined', async () => {
      messagingDep = { ...messagingDep, getAPNSToken: async () => undefined, requestPermission: async () => false };
      nativeHelperService = getNativeHelperService();
      expect(await nativeHelperService.deviceInfo.getDeviceTokenAsync()).toEqual('');
      messagingDep = { ...messagingDep, getAPNSToken: async () => null, requestPermission: async () => true };
      nativeHelperService = getNativeHelperService();
      expect(await nativeHelperService.deviceInfo.getDeviceTokenAsync()).toEqual('');
      messagingDep = { ...messagingDep, getAPNSToken: () => Promise.reject(), requestPermission: async () => true };
      nativeHelperService = getNativeHelperService();
      expect(await nativeHelperService.deviceInfo.getDeviceTokenAsync()).toEqual('');
    });

    it('should return an empty string when device token could not be get', async () => {
      messagingDep = { ...messagingDep, getAPNSToken: () => Promise.resolve(undefined), requestPermission: async () => false };
      nativeHelperService = getNativeHelperService();
      expect(await nativeHelperService.deviceInfo.getDeviceTokenAsync()).toEqual('');
    });
  });

  describe('netInfo', () => {
    it('should getState', async () => {
      const state = await nativeHelperService.netInfo.getState();
      expect(state?.isConnected).toEqual(true);
    });

    it('should subscribeToConnectionChanges', done => {
      nativeHelperService.netInfo.subscribeToConnectionChanges(isConnected => {
        expect(isConnected).toEqual(true);
        done();
      });
    });

    it('should waitForConnection when connection was already present', async () => {
      await nativeHelperService.netInfo.waitForConnection();
      expect(unsubscribe).not.toBeCalled(); /** connection was already present */
    });

    it('should waitForConnection when connection is not present', async () => {
      const timeToResolve = ENV.CONNECTION_LOSS_PAUSE_TIMEOUT / 4;
      netInfoDep = {
        fetch: () => Promise.resolve({ isConnected: false }),
        addEventListener: (cb: any) => {
          setTimeout(() => cb({ isConnected: false }), timeToResolve);
          setTimeout(() => cb({ isConnected: true }), timeToResolve * 2);
          return unsubscribe;
        }
      };
      nativeHelperService = getNativeHelperService();
      let isWaitOver = false;
      nativeHelperService.netInfo.waitForConnection().then(() => (isWaitOver = true));
      /** it should be still waiting */
      expect(isWaitOver).toBe(false);
      expect(unsubscribe).not.toBeCalled();
      /** it should be still waiting */
      await wait(timeToResolve);
      expect(isWaitOver).toBe(false);
      expect(unsubscribe).not.toBeCalled();
      await wait(timeToResolve * 2 /** error margin */);
      /** it should be done */
      expect(isWaitOver).toBe(true);
      expect(unsubscribe).toBeCalled();
    });

    it('should waitForConnection with a rejection on timeouts', async () => {
      netInfoDep = {
        fetch: () => Promise.resolve({ isConnected: false }),
        addEventListener: () => unsubscribe
      };
      nativeHelperService = getNativeHelperService();
      try {
        await nativeHelperService.netInfo.waitForConnection();
        expect(true).toBe(false);
      } catch {
        expect(true).toBe(true);
        expect(unsubscribe).toBeCalled();
      }
    });
  });

  describe('linking', () => {
    it('should open a URL', () => {
      const url = 'https://google.com';
      nativeHelperService.linking.openURL(url);
      expect(linkingDep.openURL).toBeCalledWith(url);
    });

    it('should tell if it can open a URL', () => {
      const url = 'https://google.com';
      nativeHelperService.linking.canOpenURL(url);
      expect(linkingDep.canOpenURL).toBeCalledWith(url);
    });

    it('should check a URL scheme', () => {
      const proto = 'fakeScheme';
      const query = 'query';
      nativeHelperService.linking.checkURLScheme(proto, query);
      expect(linkingDep.canOpenURL).toBeCalledWith('fakeScheme://query');
    });
    it('should get initial URL', () => {
      nativeHelperService.linking.getInitialURL();
      expect(linkingDep.getInitialURL).toBeCalled();
    });
    it('should get addEventListener', () => {
      const fn = () => null;
      nativeHelperService.linking.addEventListener('url', fn);
      expect(linkingDep.addEventListener).toBeCalledWith('url', fn);
    });
  });

  describe('buttonSdk', () => {
    it('should configure SDK with debug', () => {
      const appId = 'fakeId';
      const debug = true;
      nativeHelperService.buttonSdk.configure(appId, debug);
      expect(nativeModulesDep.ButtonIntegration.configureSDK).toBeCalledWith(appId, debug);
    });

    it('should configure SDK without debug', () => {
      const appId = 'fakeId';
      nativeHelperService.buttonSdk.configure(appId);
      expect(nativeModulesDep.ButtonIntegration.configureSDK).toBeCalledWith(appId, false);
    });

    it('should not configure if already initialized', () => {
      const appId = 'fakeId';
      nativeHelperService.buttonSdk.isConfigured = true;
      nativeHelperService.buttonSdk.configure(appId);
      expect(nativeModulesDep.ButtonIntegration.configureSDK).not.toBeCalled();
    });

    it('should set user id', () => {
      const userId = 'fakeUserId';
      nativeHelperService.buttonSdk.setUserId(userId);
      expect(nativeModulesDep.ButtonIntegration.setIdentifier).toBeCalledWith(userId);
    });

    it('should not set user id if already set', () => {
      const userId = 'fakeUserId';
      nativeHelperService.buttonSdk.isUserIdSet = true;
      nativeHelperService.buttonSdk.setUserId(userId);
      expect(nativeModulesDep.ButtonIntegration.setIdentifier).not.toBeCalled();
    });

    it('should clear all data', () => {
      nativeHelperService.buttonSdk.clearData();
      expect(nativeModulesDep.ButtonIntegration.clearAllData).toBeCalled();
    });

    it('should start a purchase path', () => {
      const url = 'http://fake.url';
      const offerId = 'fakeOfferId';
      const pubRef = 'fakePubRef';
      const callback = () => {};
      nativeHelperService.buttonSdk.purchaseRequest(url, offerId, pubRef, callback);
      expect(nativeModulesDep.ButtonIntegration.purchaseRequest).toBeCalledWith(url, offerId, pubRef, callback);
    });
  });

  describe('platform', () => {
    it('should return value depending on OS', () => {
      nativeHelperService.platform.select({ ios: 1 });
      expect(nativeHelperService.platform.select).toBeCalledWith({ ios: 1 });
    });
  });

  describe('sha256', () => {
    it('should build a hash', async () => {
      const hashResult = await nativeHelperService.hash.buildSHA256('key');
      expect(hashResult).toEqual('hash-result');
    });
  });

  describe('restart', () => {
    it('should restart', () => {
      nativeHelperService.restart();
      expect(restartDep.Restart).toBeCalled();
    });
  });

  describe('cookies', () => {
    it('should clear all cookies', async () => {
      nativeHelperService = getNativeHelperService();
      await nativeHelperService.cookieManager.clearAll(true);
      expect(cookieManagerDep.clearAll).toBeCalledWith(true);
    });

    it('should return false when clear is rejected', async () => {
      cookieManagerDep.clearAll = Promise.reject;
      nativeHelperService = getNativeHelperService();
      const res = await nativeHelperService.cookieManager.clearAll(true);
      expect(res).toBe(false);
    });
  });

  describe('isRunningOnProd', () => {
    it(`should return "${RUNTIME_ENV.DEV_TEST}" when the running environment is test`, async () => {
      nativeModulesDep.ProdChecker.getRunningEnvironment = async () => RUNTIME_ENV.DEV_TEST;
      nativeHelperService = getNativeHelperService();
      const isRunningOnProd = await nativeHelperService.getRuntimeEnv();
      expect(isRunningOnProd).toBe(RUNTIME_ENV.DEV_TEST);
    });

    it(`should return "${RUNTIME_ENV.LIVE}" when the running environment is prod`, async () => {
      nativeModulesDep.ProdChecker.getRunningEnvironment = async () => RUNTIME_ENV.LIVE;
      nativeHelperService = getNativeHelperService();
      const isRunningOnProd = await nativeHelperService.getRuntimeEnv();
      expect(isRunningOnProd).toBe(RUNTIME_ENV.LIVE);
    });
  });

  describe('messaging', () => {
    it('should hasPermission', async () => {
      await nativeHelperService.messaging.hasPermission();
      expect(messagingDep.hasPermission).toBeCalled();
    });

    it('should requestPermission', async () => {
      await nativeHelperService.messaging.requestPermission();
      expect(messagingDep.requestPermission).toBeCalled();
    });
  });
});

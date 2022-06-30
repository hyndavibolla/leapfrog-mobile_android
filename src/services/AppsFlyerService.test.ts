import { NativeModules } from 'react-native';
import { act } from 'react-test-renderer';

import { getMockDeps } from '_test_utils/getMockDeps';
import { ConversionEventType } from '_constants';
import { wait } from '_utils/wait';

import AppsFlyerService from './AppsFlyerService';
import { Logger } from './Logger';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.NativeModules.RNAppsFlyer = {
    onDeepLink: jest.fn(),
    updateServerUninstallToken: jest.fn(),
    logEvent: jest.fn().mockResolvedValue(true),
    logEventWithPromise: jest.fn(() => Promise.resolve('')),
    setCustomerUserId: jest.fn(),
    initSdkWithPromise: jest.fn(),
    logEventPromise: jest.fn(),
    logEventCallback: jest.fn()
  };

  RN.UIManager.getViewManagerConfig = name => {
    if (name === 'SomeNativeModule') {
      return { someMethod: jest.fn() };
    }
    return {};
  };
  return RN;
});

let logger: Logger;
let appsFlyerService: AppsFlyerService;

describe('AppsFlyerService', () => {
  beforeEach(() => {
    const handler = jest.fn();
    logger = getMockDeps().logger;
    appsFlyerService = new AppsFlyerService(logger);
    appsFlyerService.addDeepLinkEventListener(handler);
  });

  it('should init AppsFlyerServiceSDK', async () => {
    await act(() => wait(0));
    expect(logger.info).toBeCalledWith(expect.any(String), expect.any(Object));
    expect(logger.debug).toBeCalledWith(expect.any(String), expect.any(Object));
  });

  it('should update uninstall token', async () => {
    const updateServerUninstallToken = jest.spyOn(appsFlyerService, 'updateServerUninstallToken');
    appsFlyerService.updateServerUninstallToken('token');
    expect(updateServerUninstallToken).toBeCalledWith('token');
  });

  it('should track events to appsflyer', async () => {
    const data = { a: 'a' };

    const trackConversionEvent = jest.spyOn(appsFlyerService, 'trackConversionEvent');
    appsFlyerService.trackConversionEvent(ConversionEventType.LOGIN, data);
    await act(() => wait(0));
    expect(trackConversionEvent).toBeCalledWith(ConversionEventType.LOGIN, data);
    expect(logger.debug).toBeCalledWith(expect.any(String), data);
  });

  it('should log errors when failing to track events to appsflyer', async () => {
    const data = { a: 'a' };
    const trackConversionEvent = jest.spyOn(appsFlyerService, 'trackConversionEvent');
    const logEvent = jest.spyOn(NativeModules.RNAppsFlyer, 'logEventWithPromise');

    logEvent.mockRejectedValue({ error: 'error' });

    appsFlyerService.trackConversionEvent(ConversionEventType.LOGIN, data);
    await act(() => wait(0));
    expect(trackConversionEvent).toBeCalledWith(ConversionEventType.LOGIN, data);
    expect(logger.error).toBeCalledWith({ error: 'error' }, expect.anything());
  });

  it('should add an event handler for deep links', async () => {
    const handler = jest.fn();

    const addDeepLinkEventListener = jest.spyOn(appsFlyerService, 'addDeepLinkEventListener');
    appsFlyerService.addDeepLinkEventListener(handler);
    expect(addDeepLinkEventListener).toBeCalledWith(handler);
  });

  it('should remove an event handler for deep links', async () => {
    const data = 5 as any;
    const handler = jest.fn();
    const onDeepLink = jest.spyOn(NativeModules.RNAppsFlyer, 'onDeepLink');
    onDeepLink.mockReturnValueOnce(
      jest.fn(async h => {
        await wait(0);
        h(data);
      })
    );

    appsFlyerService.addDeepLinkEventListener(handler);
    expect(handler).not.toBeCalled();
    appsFlyerService.removeDeepLinkEventListener(handler);
    await wait(0);
    expect(handler).not.toBeCalled();
  });

  it('should remove all events handler for deep links', async () => {
    const clearDeepLinkEventListener = jest.spyOn(appsFlyerService, 'clearDeepLinkEventListener');
    appsFlyerService.clearDeepLinkEventListener();
    expect(clearDeepLinkEventListener).toBeCalled();
  });

  it('should execute setCustomerUserId', async () => {
    const userId = '1234';

    const setCustomerUserId = jest.spyOn(appsFlyerService, 'setCustomerUserId');
    appsFlyerService.setCustomerUserId(userId);
    expect(setCustomerUserId).toBeCalled();
  });
});

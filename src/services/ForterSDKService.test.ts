import { NativeModules } from 'react-native';
import { act } from 'react-test-renderer';

import { getMockDeps } from '_test_utils/getMockDeps';
import { ENV, ForterActionType, ForterNavigationType } from '_constants';
import { wait } from '_utils/wait';

import ForterSDKService from './ForterSDKService';
import { Logger } from './Logger';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.NativeModules.RNForter = {
    setDevLogsEnabled: jest.fn(),
    getDeviceUniqueID: jest.fn(cb => cb()),
    initSdk: jest.fn((a, b, c) => c()),
    trackNavigation: jest.fn(),
    trackNavigationWithExtraData: jest.fn(),
    trackAction: jest.fn(),
    trackActionWithJSON: jest.fn()
  };

  RN.UIManager.getViewManagerConfig = name => {
    if (name === 'SomeNativeModule') {
      return { someMethod: jest.fn() };
    }
    return {};
  };
  return RN;
});

const screenName = 'screen';
let logger: Logger;
let forterSDKService: ForterSDKService;

describe('ForterSDKService', () => {
  beforeEach(() => {
    logger = getMockDeps().logger;
    forterSDKService = new ForterSDKService(logger);
  });

  it('should show error when init ForterSDK', async () => {
    const initSdk = jest.spyOn(NativeModules.RNForter, 'initSdk');
    initSdk.mockImplementation(jest.fn((a, b, c, d: any) => d()));

    logger = getMockDeps().logger;
    forterSDKService = new ForterSDKService(logger);
    await act(() => wait(0));
    expect(logger.error).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
  });
  it('should execute init function', async () => {
    const deviceId = 'device-id';
    const init = jest.spyOn(forterSDKService, 'init');
    forterSDKService.init(ENV.FORTER_SITE_ID, deviceId, jest.fn(), jest.fn());
    expect(init).toBeCalled();
  });

  it('should execute setDevLogsEnabled function', async () => {
    const setDevLogsEnabled = jest.spyOn(forterSDKService, 'setDevLogsEnabled');
    forterSDKService.setDevLogsEnabled();
    expect(setDevLogsEnabled).toBeCalled();
  });

  it('should execute getDeviceUniqueID function', async () => {
    const getDeviceUniqueID = jest.spyOn(forterSDKService, 'getDeviceUniqueID');
    forterSDKService.getDeviceUniqueID(() => jest.fn());
    expect(getDeviceUniqueID).toBeCalled();
  });

  it('should execute trackNavigation function', async () => {
    const trackNavigation = jest.spyOn(forterSDKService, 'trackNavigation');
    forterSDKService.trackNavigation(screenName, ForterNavigationType.ACCOUNT);
    expect(trackNavigation).toBeCalled();
  });

  it('should execute trackNavigationWithExtraData function', async () => {
    const itemId = '1234';
    const itemCategory = 'category';
    const otherInfo = 'info';
    const trackNavigationWithExtraData = jest.spyOn(forterSDKService, 'trackNavigationWithExtraData');
    forterSDKService.trackNavigationWithExtraData(screenName, ForterNavigationType.ACCOUNT, itemId, itemCategory, otherInfo);
    expect(trackNavigationWithExtraData).toBeCalled();
  });

  it('should execute trackAction function', async () => {
    const trackAction = jest.spyOn(forterSDKService, 'trackAction');
    forterSDKService.trackAction(ForterActionType.ACCEPTED_PROMOTION);
    expect(trackAction).toBeCalled();
  });

  it('should execute trackActionWithJSON function', async () => {
    const dictionary = { name: 'action' };
    const trackActionWithJSON = jest.spyOn(forterSDKService, 'trackActionWithJSON');
    forterSDKService.trackActionWithJSON(ForterActionType.ACCEPTED_PROMOTION, dictionary);
    expect(trackActionWithJSON).toBeCalled();
  });

  it('should execute fraudTrackNavigationEvent function', async () => {
    const fraudTrackNavigationEvent = jest.spyOn(forterSDKService, 'fraudTrackNavigationEvent');
    forterSDKService.fraudTrackNavigationEvent(screenName, ForterNavigationType.ACCOUNT);
    expect(fraudTrackNavigationEvent).toBeCalled();
  });

  it('should execute fraudTrackAction function', async () => {
    const json = { name: 'action' };
    const fraudTrackAction = jest.spyOn(forterSDKService, 'fraudTrackAction');
    forterSDKService.fraudTrackAction(ForterActionType.ACCEPTED_PROMOTION, json);
    expect(fraudTrackAction).toBeCalled();
  });
});

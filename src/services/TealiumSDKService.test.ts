import { getMockDeps } from '_test_utils/getMockDeps';
import { TealiumEventType } from '_constants';

import TealiumSDKService from './TealiumSDKService';
import { Logger } from './Logger';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.NativeModules.TealiumModule = {
    trackEvent: jest.fn(),
    trackView: jest.fn()
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
let tealiumSDKService: TealiumSDKService;

describe('TealiumSDKService', () => {
  beforeEach(() => {
    logger = getMockDeps().logger;
    tealiumSDKService = new TealiumSDKService(logger);
  });

  it('should execute track function', async () => {
    const data = { a: 'a' };
    const track = jest.spyOn(tealiumSDKService, 'track');
    tealiumSDKService.track(TealiumEventType.LOGIN, data);
    expect(track).toBeCalled();
  });

  it('should execute trackView function', async () => {
    const event = 'event';
    const data = { a: 'a' };
    const trackView = jest.spyOn(tealiumSDKService, 'trackView');
    tealiumSDKService.trackView(event, data);
    expect(trackView).toBeCalled();
  });
});

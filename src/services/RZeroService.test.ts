import { NativeModules } from 'react-native';

import { getMockDeps } from '_test_utils/getMockDeps';
import { ENV } from '_constants';
import { FeatureFlag } from '_models/general';

import RZeroService from './RZeroService';
import { Logger } from './Logger';

const mockRZero = {
  setUserId: jest.fn(),
  sendEventForVisibilityChange: jest.fn(),
  logEvent: jest.fn(),
  flush: jest.fn()
};

let logger: Logger = getMockDeps().logger;
let rZeroService: RZeroService = new RZeroService(logger);
NativeModules.RZeroIntegration = mockRZero;

describe('RZeroService', () => {
  let ignoredFeatureFlags: FeatureFlag[];

  beforeAll(() => {
    ignoredFeatureFlags = ENV.IGNORED_FEATURE_LIST;
  });

  beforeEach(() => {
    logger = getMockDeps().logger;
    rZeroService = new RZeroService(logger);
    NativeModules.RZeroIntegration = mockRZero;
    ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
  });

  afterAll(() => {
    ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
  });

  it('should not execute trackView function without path', async () => {
    await rZeroService.trackView(undefined, true);
    expect(mockRZero.sendEventForVisibilityChange).not.toBeCalled();
  });

  it('should execute setUser function', () => {
    rZeroService.setUser('user');
    expect(mockRZero.setUserId).toBeCalled();
  });

  it('should execute trackView function', () => {
    rZeroService.trackView('screen', true);
    expect(mockRZero.sendEventForVisibilityChange).toBeCalledWith('screen', true);
  });

  it('should execute trackEvent function', () => {
    rZeroService.trackEvent('event');
    expect(mockRZero.logEvent).toBeCalledWith('event');
  });

  it('should execute flush function', () => {
    rZeroService.flush();
    expect(mockRZero.flush).toBeCalledWith();
  });
});

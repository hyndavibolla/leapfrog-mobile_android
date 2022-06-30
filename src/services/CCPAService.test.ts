import { TrackingStatus } from 'react-native-tracking-transparency';
import { CCPAService, OneTrustNativeSDK } from './CCPAService';
import { ENV } from '../constants';
import { getMockDeps } from '_test_utils/getMockDeps';
import { Logger } from '_services/Logger';

class MockOneTrustNativeSDK {
  static startSDK = jest.fn();
  static showBannerUI = jest.fn();
  static listenForConsentChanges = jest.fn().mockImplementation((cat, cb) => cb(cat, 1));
  static setBroadcastAllowedValues = jest.fn();
  static stopListeningForConsentChanges = jest.fn();
}

describe('CCPAService', () => {
  let ccpaService: CCPAService;
  let sdk: OneTrustNativeSDK;
  let Platform: any;
  let logger: Logger;
  let requestTrackingPermission: () => Promise<TrackingStatus>;

  beforeEach(() => {
    sdk = MockOneTrustNativeSDK;
    sdk.startSDK = jest.fn().mockResolvedValue({});
    sdk.showBannerUI = jest.fn();
    sdk.listenForConsentChanges = jest.fn().mockImplementation((cat, cb) => cb(cat, 1));
    sdk.stopListeningForConsentChanges = jest.fn();

    logger = getMockDeps().logger;
    Platform = { select: opts => opts.ios };
    requestTrackingPermission = jest.fn().mockResolvedValue('authorized');
  });

  it('should init the sdk for android', () => {
    Platform = { select: opts => opts.android };
    ccpaService = new CCPAService(sdk, Platform, logger);
    expect(sdk.startSDK).toBeCalledWith(ENV.ONE_TRUST.ANDROID.URL, ENV.ONE_TRUST.ANDROID.ID, 'en', { countryCode: 'us', regionCode: 'ca' }, false);
  });

  it('should init the sdk for ios', () => {
    Platform = { select: opts => opts.ios };
    ccpaService = new CCPAService(sdk, Platform, logger);
    expect(sdk.startSDK).toBeCalledWith(ENV.ONE_TRUST.IOS.URL, ENV.ONE_TRUST.IOS.ID, 'en', { countryCode: 'us', regionCode: 'ca' }, false);
    expect(sdk.setBroadcastAllowedValues).toHaveBeenCalled();
  });

  it('should showConsentBanner accepting', async () => {
    ccpaService = new CCPAService(sdk, Platform, logger);
    const allow = await ccpaService.showConsentBanner();
    expect(allow).toBe(true);
    expect(requestTrackingPermission).not.toBeCalled();
  });

  it('should showConsentBanner', async () => {
    ccpaService = new CCPAService(sdk, Platform, logger);
    await ccpaService.showConsentBanner();
    expect(sdk.showBannerUI).toBeCalled();
  });

  it('should showConsentBanner accepting but not request tracking if the user did not consent', async () => {
    sdk.listenForConsentChanges = jest.fn().mockImplementation((cat, cb) => cb(cat, 0));
    ccpaService = new CCPAService(sdk, Platform, logger);
    const allow = await ccpaService.showConsentBanner();
    expect(allow).toBe(false);
  });

  it('should showConsentBanner rejecting', async () => {
    sdk.showBannerUI = jest.fn().mockImplementation(() => {
      throw new Error('Example error');
    });
    ccpaService = new CCPAService(sdk, Platform, logger);
    const allow = await ccpaService.showConsentBanner();
    expect(allow).toBe(false);
  });

  it('should report an error if the SDK object is not available for calling', () => {
    ccpaService = new CCPAService(null, Platform, logger);
    expect(sdk.startSDK).not.toBeCalled();
  });

  it('should report an error if the SDK cannot be started', async () => {
    sdk.startSDK = jest.fn().mockRejectedValue(new Error('Example error'));
    ccpaService = new CCPAService(sdk, Platform, logger);
    await ccpaService.startSDK();
    expect(sdk.startSDK).toBeCalled();
    expect(logger.error).toBeCalled();
  });

  it('should report an error if the consent banner cannot be displayed', async () => {
    ccpaService = new CCPAService(sdk, Platform, logger);
    sdk.showBannerUI = jest.fn().mockImplementation(() => {
      throw new Error('Example error');
    });
    const allow = await ccpaService.showConsentBanner();
    expect(logger.error).toBeCalled();
    expect(allow).toBe(false);
  });
});

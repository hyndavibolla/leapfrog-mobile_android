import { TrackingStatus } from 'react-native-tracking-transparency';

import { ENV } from '_constants';
import { FeatureFlag, ICCPASetting } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { wait } from '_utils/wait';
import RZeroService from '_services/RZeroService';
import TealiumSDKService from '_services/TealiumSDKService';

import { EventTrackerService } from './EventTrackerService';
import { Logger } from './Logger';

describe('EventTrackerService', () => {
  let eventTrackerService: EventTrackerService;
  let logger: Logger;
  let tealiumSdk: TealiumSDKService;
  let appsFlyerSdk: any;
  let forterSdk: any;
  let sailthruService: any;
  let getTrackingStatus: () => Promise<TrackingStatus>;
  let requestTrackingPermission: () => Promise<TrackingStatus>;
  let cCPASetting: () => Promise<ICCPASetting>;
  let rZero: RZeroService;
  const getEventTrackerService = () =>
    new EventTrackerService(tealiumSdk, appsFlyerSdk, sailthruService, forterSdk, logger, getTrackingStatus, requestTrackingPermission, cCPASetting, rZero);

  beforeEach(() => {
    appsFlyerSdk = {
      updateServerUninstallToken: jest.fn(),
      setCustomerUserId: jest.fn().mockImplementation((_, cb) => cb('success')),
      addDeepLinkEventListener: jest.fn(),
      removeDeepLinkEventListener: jest.fn(),
      clearDeepLinkEventListener: jest.fn(),
      trackConversionEvent: jest.fn()
    };

    logger = getMockDeps().logger;
    sailthruService = {
      setUserId: jest.fn(),
      setUserEmail: jest.fn(),
      setExtId: jest.fn()
    };
    tealiumSdk = {
      initialize: jest.fn(),
      trackEvent: jest.fn(),
      trackView: jest.fn()
    } as any;
    getTrackingStatus = jest.fn().mockResolvedValue('authorized');
    requestTrackingPermission = jest.fn().mockResolvedValue('authorized');
    cCPASetting = jest.fn().mockResolvedValue({ allow: false });
    forterSdk = {
      setDevLogsEnabled: jest.fn(),
      getDeviceUniqueID: jest.fn(cb => cb()),
      init: jest.fn((a, b, c) => c()),
      trackNavigation: jest.fn(),
      trackNavigationWithExtraData: jest.fn(),
      trackAction: jest.fn(),
      trackActionWithJSON: jest.fn(),
      fraudTrackNavigationEvent: jest.fn(),
      fraudTrackAction: jest.fn()
    };
    eventTrackerService = getEventTrackerService();
  });

  it("should track user's data", async () => {
    eventTrackerService.isTrackingEnabled = jest.fn().mockResolvedValue(true);
    eventTrackerService.trackDataUser('test@test.com', '54321', 'extId1234');
    await wait(0);
    expect(sailthruService.setUserId).toBeCalledWith('54321');
    expect(sailthruService.setUserEmail).toBeCalledWith('test@test.com');
    expect(sailthruService.setExtId).toBeCalledWith('extId1234');
    expect(appsFlyerSdk.setCustomerUserId).toBeCalledWith('extId1234', expect.any(Function));
  });

  it("should not track user's data in Sailthru if disabled", async () => {
    const ignoredFeatures = ENV.IGNORED_FEATURE_LIST;
    ENV.IGNORED_FEATURE_LIST = [...ENV.IGNORED_FEATURE_LIST, FeatureFlag.SAILTHRU_TRACKING];

    eventTrackerService.isTrackingEnabled = jest.fn().mockResolvedValue(true);
    eventTrackerService.trackDataUser('test@test.com', '54321', 'extId1234');
    await wait(0);

    ENV.IGNORED_FEATURE_LIST = ignoredFeatures;

    expect(sailthruService.setUserId).not.toBeCalled();
    expect(sailthruService.setUserEmail).not.toBeCalled();
    expect(sailthruService.setExtId).not.toBeCalled();
    expect(appsFlyerSdk.setCustomerUserId).toHaveBeenCalled();
  });

  it('should log an error when sailthru tracking fails', async () => {
    eventTrackerService.isTrackingEnabled = jest.fn().mockResolvedValue(true);
    sailthruService.setUserId = jest.fn().mockRejectedValue('some error');

    await eventTrackerService.trackDataUser('test@test.com', '54321', 'extId1234');

    expect(logger.error).toHaveBeenCalled();
    expect(appsFlyerSdk.setCustomerUserId).toBeCalledWith('extId1234', expect.any(Function));
  });

  it('should not track data user', async () => {
    eventTrackerService.isTrackingEnabled = jest.fn().mockResolvedValue(false);
    eventTrackerService.trackDataUser('test@test.com', '54321', 'extId1234');
    await wait(0);
    expect(sailthruService.setUserEmail).toBeCalled();
    expect(sailthruService.setUserId).toBeCalled();
    expect(sailthruService.setExtId).toBeCalled();
    expect(appsFlyerSdk.setCustomerUserId).not.toBeCalled();
  });

  it('should return true if the user is authorized', async () => {
    expect(await eventTrackerService.isTrackingEnabled()).toBe(true);
  });

  it('should return false if the user is denied', async () => {
    getTrackingStatus = jest.fn().mockResolvedValue('denied');
    eventTrackerService = getEventTrackerService();
    expect(await eventTrackerService.isTrackingEnabled()).toBe(false);
  });

  it('should return false if the user is restricted', async () => {
    getTrackingStatus = jest.fn().mockResolvedValue('restricted');
    eventTrackerService = getEventTrackerService();
    expect(await eventTrackerService.isTrackingEnabled()).toBe(false);
  });

  it('should return true if the user is authorized and consent is allowed', async () => {
    getTrackingStatus = jest.fn().mockResolvedValue('not-determined');
    cCPASetting = jest.fn().mockResolvedValue({ allow: true });

    expect(await eventTrackerService.isTrackingEnabled()).toBe(true);
  });

  it('should return false if the user is not authorized and consent is allowed', async () => {
    getTrackingStatus = jest.fn().mockResolvedValue('not-determined');
    requestTrackingPermission = jest.fn().mockResolvedValue('denied');
    cCPASetting = jest.fn().mockResolvedValue({ allow: true });
    eventTrackerService = getEventTrackerService();
    expect(await eventTrackerService.isTrackingEnabled()).toBe(false);
  });

  it('should return rZero', async () => {
    expect(eventTrackerService.rZero).toBe(rZero);
  });

  it('should return forterSDK', async () => {
    expect(eventTrackerService.forterSDK).toBe(forterSdk);
  });

  it('should return tealiumSDK', async () => {
    expect(eventTrackerService.tealiumSDK).toBe(tealiumSdk);
  });

  it('should return appsFlyerSDK', async () => {
    expect(eventTrackerService.appsFlyerSDK).toBe(appsFlyerSdk);
  });
});

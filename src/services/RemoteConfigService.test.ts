import { getMockDeps } from '../test-utils/getMockDeps';
import { RemoteConfigService } from './RemoteConfigService';
import { Logger } from './Logger';
import { ENV } from '../constants';
import { wait } from '../utils/wait';

describe('RemoteConfigService', () => {
  let remoteConfigService: RemoteConfigService;
  let sdk: any;
  let logger: Logger;

  beforeEach(() => {
    sdk = {
      setDefaults: jest.fn(),
      setConfigSettings: jest.fn(),
      fetchAndActivate: jest.fn().mockResolvedValue(true),
      getValue: jest.fn().mockReturnValue({ asString: () => '{ "value": 1 }' }),
      getAll: jest.fn().mockReturnValue({ ab_testing: { value: 1 } })
    };
    logger = getMockDeps().logger;
    remoteConfigService = new RemoteConfigService((() => sdk) as any, logger);
  });

  it('should init the sdk', async () => {
    expect(sdk.setDefaults).toBeCalledWith(ENV.REMOTE_CONFIG.DEFAULT_CONFIG);
    expect(sdk.setConfigSettings).toBeCalledWith(expect.any(Object));
    expect(await remoteConfigService.isSdkReady).toBe(true);
  });

  it('should init the sdk and fail', async () => {
    sdk.fetchAndActivate = Promise.reject;
    remoteConfigService = new RemoteConfigService((() => sdk) as any, logger);
    expect(await remoteConfigService.isSdkReady).toBe(false);
  });

  it('should return a value when sdk is successfully initialized ', async () => {
    expect(await remoteConfigService.getValue('key')).toEqual({ value: 1 });
  });

  it('should return the default value when sdk is NOT successfully initialized', async () => {
    sdk.fetchAndActivate = Promise.reject;
    remoteConfigService = new RemoteConfigService((() => sdk) as any, logger);
    expect(await remoteConfigService.getValue(ENV.REMOTE_CONFIG.KEY.APP_VERSION)).toEqual(ENV.REMOTE_CONFIG.DEFAULT_CONFIG[ENV.REMOTE_CONFIG.KEY.APP_VERSION]);
  });

  it('should return a directly from cache without waiting for the sdk to load ', async () => {
    expect(remoteConfigService.getImmediateValue('key')).toEqual({ value: 1 });
  });

  it('should return the default value fetching directly from cache when sdk has no default value cached', async () => {
    sdk.getValue = jest.fn().mockReturnValue({ asString: () => undefined });
    remoteConfigService = new RemoteConfigService((() => sdk) as any, logger);
    expect(remoteConfigService.getImmediateValue(ENV.REMOTE_CONFIG.KEY.APP_VERSION)).toEqual(
      ENV.REMOTE_CONFIG.DEFAULT_CONFIG[ENV.REMOTE_CONFIG.KEY.APP_VERSION]
    );
  });

  it('should fetch and activate only once at a time', async () => {
    const timeout = 200;
    const mock = jest.fn();
    sdk.fetchAndActivate = async () => {
      wait(timeout);
      mock();
      return true;
    };
    remoteConfigService = new RemoteConfigService((() => sdk) as any, logger);
    remoteConfigService.fetchAndActivate();
    remoteConfigService.fetchAndActivate();
    remoteConfigService.fetchAndActivate();
    remoteConfigService.fetchAndActivate();
    await wait(timeout);
    expect(mock).toBeCalledTimes(2); // adding +1 because of the constructor waiting for this to finish
    remoteConfigService.fetchAndActivate();
    await wait(timeout);
    expect(mock).toBeCalledTimes(3);
  });

  it('should return all the default values when sdk is NOT successfully initialized', async () => {
    sdk.fetchAndActivate = Promise.reject;
    remoteConfigService = new RemoteConfigService((() => sdk) as any, logger);
    expect(await remoteConfigService.getAll()).toBeUndefined();
  });

  it('should return all values when sdk is successfully initialized ', async () => {
    expect(await remoteConfigService.getAll()).toEqual({ ab_testing: { value: 1 } });
  });

  it('should return all values when without checking sdk has been successfully initialized ', () => {
    expect(remoteConfigService.getImmediateAll()).toEqual({ ab_testing: { value: 1 } });
  });
});

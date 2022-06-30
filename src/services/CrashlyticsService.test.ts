import { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics';
import CrashlyticsService, { ICrashlyticsService } from './CrashlyticsService';
import { LogMethod } from './Logger';

describe('CrashlyticsService', () => {
  let crashlyticsService: ICrashlyticsService;
  let crashlytics: FirebaseCrashlyticsTypes.Module;

  beforeEach(() => {
    crashlytics = {
      log: jest.fn(),
      recordError: jest.fn(),
      setAttributes: jest.fn(),
      setUserId: jest.fn(),
      setCrashlyticsCollectionEnabled: jest.fn()
    } as any; // cast because FirebaseCrashlyticsTypes.Module requires a lot more fields we don't use

    crashlyticsService = new CrashlyticsService(crashlytics);
  });

  describe('recordError', () => {
    it('should report errors (no metadata)', () => {
      crashlyticsService.recordError(new Error());
      expect(crashlytics.log).not.toBeCalled();
      expect(crashlytics.recordError).toBeCalled();
    });

    it('should report errors', () => {
      const metadata = { metadata1: 1, metadata2: 2 };
      const error = new Error('errorMessage');

      crashlyticsService.recordError(error, metadata);
      expect(crashlytics.log).toBeCalledWith(JSON.stringify({ metadata }));
      expect(crashlytics.recordError).toBeCalledWith(error);
    });
  });

  describe('log', () => {
    it('should send logs', () => {
      const level = LogMethod.INFO;
      const message = 'Something happened!';
      crashlyticsService.log(level, message);
      expect(crashlytics.log).toBeCalledWith(expect.stringMatching(`.*${level}.*${message}`));
    });
  });

  describe('setCrashlyticsCollectionEnabled', () => {
    it('calls the crashlytics method', async () => {
      await crashlyticsService.setCrashlyticsCollectionEnabled(true);
      expect(crashlytics.setCrashlyticsCollectionEnabled).toBeCalledWith(true);
    });
  });

  describe('initialize', () => {
    it('calls the crashlytics method', async () => {
      await crashlyticsService.initialize('12345', { a: '1', b: '2' });
      expect(crashlytics.setUserId).toBeCalledWith('12345');
      expect(crashlytics.setAttributes).toBeCalledWith({ a: '1', b: '2' });
    });
  });
});

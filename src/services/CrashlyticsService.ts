import { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics';
import { LogMethod } from './Logger';

export interface ICrashlyticsService {
  initialize(userId: string, attributes: { [key: string]: string }): Promise<null>;
  log: (level: LogMethod, message: string) => void;
  recordError: (error: Error, metadata?: Record<string, any>) => void;
  setCrashlyticsCollectionEnabled(enabled: boolean): Promise<null>;
}

export default class CrashlyticsService implements ICrashlyticsService {
  constructor(private crashlytics: FirebaseCrashlyticsTypes.Module) {}

  initialize = (userId: string, attributes: { [key: string]: string }): Promise<null> => {
    // .then() combines Promise<[null, null]> into Promise<null>
    return Promise.all([this.crashlytics.setUserId(userId), this.crashlytics.setAttributes(attributes)]).then();
  };

  log = (level: string, message: string) => {
    this.crashlytics.log(`[${level}] ${message}`);
  };

  recordError = (error: Error, metadata?: Record<string, any>) => {
    if (metadata !== undefined) {
      this.crashlytics.log(JSON.stringify({ metadata }));
    }

    error.stack = `${error.message}\n${error.stack}`;
    this.crashlytics.recordError(error);
  };

  setCrashlyticsCollectionEnabled(enabled: boolean): Promise<null> {
    return this.crashlytics.setCrashlyticsCollectionEnabled(enabled);
  }
}

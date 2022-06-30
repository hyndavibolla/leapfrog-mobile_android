import remoteConfig from '@react-native-firebase/remote-config';

import { ENV } from '../constants';
import { safeParse } from '../utils/safeParse';
import { Logger, LogMethod } from './Logger';

export class RemoteConfigService {
  isSdkReady: Promise<boolean>;

  constructor(private remoteConfigDep: typeof remoteConfig, private logger: Logger) {
    this.init();
  }

  private init = async () => {
    this.isSdkReady = new Promise(async resolve => {
      await Promise.all([
        this.remoteConfigDep().setDefaults(ENV.REMOTE_CONFIG.DEFAULT_CONFIG),
        this.remoteConfigDep().setConfigSettings({ minimumFetchIntervalMillis: ENV.REMOTE_CONFIG.CACHE_TIMEOUT })
      ]);
      const activated = await this.fetchAndActivate();
      resolve(activated);
    });
  };

  /** meant to refetch if needed */
  fetchAndActivate = (() => {
    let onGoingProcess: Promise<boolean>;
    const fn = async (): Promise<boolean> => {
      try {
        const activated = await this.remoteConfigDep().fetchAndActivate();
        this.logger.assert(LogMethod.DEBUG, activated, 'Remote config were retrieved from the backend and activated.');
        this.logger.assert(LogMethod.DEBUG, !activated, 'No remote config were fetched from the backend, and the local configs were already activated');
        return activated;
      } catch (error) {
        this.logger.error(error, { context: 'Error fetching and activating remote config' });
        return false;
      } finally {
        onGoingProcess = undefined;
      }
    };
    return () => {
      if (!onGoingProcess) onGoingProcess = fn();
      return onGoingProcess;
    };
  })();

  getValue = async <T>(key: string): Promise<T> => {
    if (await this.isSdkReady) return safeParse(this.remoteConfigDep().getValue(key).asString());
    return ENV.REMOTE_CONFIG.DEFAULT_CONFIG[key];
  };

  getImmediateValue = <T>(key: string): T => {
    return safeParse(this.remoteConfigDep().getValue(key).asString()) || ENV.REMOTE_CONFIG.DEFAULT_CONFIG[key];
  };

  getAll = async (): Promise<Object> => {
    if (await this.isSdkReady) return safeParse(this.remoteConfigDep().getAll());
    return;
  };

  getImmediateAll = (): Promise<Object> => {
    return safeParse(this.remoteConfigDep().getAll());
  };
}

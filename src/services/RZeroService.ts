import { NativeModules } from 'react-native';

import { Logger } from './Logger';

class RZeroService {
  constructor(private logger: Logger) {}

  setUser(userId: string): void {
    this.logger.info('rZero set user', userId);
    return NativeModules.RZeroIntegration.setUserId(userId);
  }

  trackView(path: string, isEntering: boolean): void {
    if (!path) return;
    this.logger.info('rZero view tracking event', { path, isEntering });
    return NativeModules.RZeroIntegration.sendEventForVisibilityChange(path, isEntering);
  }

  trackEvent(event: string): void {
    this.logger.info('rZero tracking event', event);
    return NativeModules.RZeroIntegration.logEvent(event);
  }

  flush(): void {
    this.logger.info('rZero flush');
    return NativeModules.RZeroIntegration.flush();
  }
}

export default RZeroService;

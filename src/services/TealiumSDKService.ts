import Tealium from 'tealium-react-native';
import { TealiumConfig, TealiumEvent, TealiumView } from 'tealium-react-native/common';

import { ENV, TealiumEventType } from '_constants';

import { Logger } from './Logger';

class TealiumSDKService {
  constructor(private logger: Logger) {
    this.initTealiumSDK();
  }

  private initTealiumSDK() {
    try {
      /* istanbul ignore next line */
      const config: TealiumConfig = {
        account: ENV.TEALIUM.ACCOUNT,
        profile: ENV.TEALIUM.PROFILE,
        environment: ENV.IS_UAT ? 'qa' : ENV.ENVIRONMENT,
        collectors: [],
        dispatchers: []
      };
      Tealium.initialize(config);
    } catch (error) {
      this.logger.error(error, { context: 'Error initializing Tealium SDK' });
    }
  }

  track(eventName: TealiumEventType, data: Record<string, string | string[]>) {
    try {
      const cleanData = JSON.parse(JSON.stringify(data));
      this.logger.debug('Tealium: Tracking event', { eventName, cleanData });
      const event = new TealiumEvent(eventName, cleanData);
      Tealium.track(event);
    } catch {}
  }

  trackView(screenName: string, data: Record<string, string | string[]>) {
    try {
      const cleanData = JSON.parse(JSON.stringify(data));
      this.logger.debug(`Tealium Tracking view "${screenName}"`, cleanData);
      const view = new TealiumView(screenName, data);
      Tealium.track(view);
    } catch {}
  }
}

export default TealiumSDKService;

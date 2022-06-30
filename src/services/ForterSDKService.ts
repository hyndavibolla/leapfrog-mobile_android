import { forterSDK } from 'react-native-forter';

import { ForterActionType, ForterNavigationType, ENV } from '_constants';

import { Logger } from './Logger';

class ForterSDKService {
  constructor(private logger: Logger) {
    this.initForterSDK();
  }

  private initForterSDK() {
    forterSDK.setDevLogsEnabled();
    forterSDK.getDeviceUniqueID(deviceId => {
      forterSDK.init(
        ENV.FORTER_SITE_ID,
        deviceId,
        successResult => this.logger.info('ForterSDK initialized', { successResult, deviceId }),
        errorResult => this.logger.error('Error initializing ForterSDK', { errorResult, deviceId })
      );
    });
  }

  setDevLogsEnabled() {
    forterSDK.setDevLogsEnabled();
  }

  getDeviceUniqueID(callback: (deviceId: string) => void): void {
    return forterSDK.getDeviceUniqueID(deviceId => callback(deviceId));
  }

  init(sideId: string, deviceId: string, onSuccess: (result: any) => void, onError: (result: any) => void) {
    forterSDK.init(sideId, deviceId, onSuccess, onError);
  }

  trackNavigation(screenName: string, navigationType: ForterNavigationType) {
    forterSDK.trackNavigation(screenName, navigationType);
  }

  trackNavigationWithExtraData(screenName: string, navigationType: ForterNavigationType, itemId: string, itemCategory: string, otherInfo: any) {
    forterSDK.trackNavigation(screenName, navigationType, itemId, itemCategory, otherInfo);
  }

  trackAction(actionType: ForterActionType) {
    forterSDK.trackAction(actionType);
  }

  trackActionWithJSON(actionType: ForterActionType, dictionary: Record<string, any>) {
    forterSDK.trackAction(actionType, dictionary);
  }

  fraudTrackNavigationEvent(screenName: string, eventType: ForterNavigationType) {
    this.logger.debug(`Forter Tracking view "${screenName}" of type "${eventType}"`);
    this.trackNavigation(screenName, eventType);
  }

  fraudTrackAction(actionType: ForterActionType, json: Record<string, any>) {
    const cleanData = JSON.parse(JSON.stringify(json));
    this.logger.debug(`Forter Tracking action "${actionType}"`, cleanData);
    this.trackActionWithJSON(actionType, cleanData);
  }
}

export default ForterSDKService;

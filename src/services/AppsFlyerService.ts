import { Platform } from 'react-native';
import AppsFlyer, { UnifiedDeepLinkData } from 'react-native-appsflyer';

import { ENV, ConversionEventType } from '_constants';
import { DateLike } from '_models/general';

import { Logger } from './Logger';

export interface IDeepLinkStoredSid {
  sid: string;
  inactiveDate: DateLike;
}

export interface IAppsflyerDeepLinkData {
  status: string;
  deepLinkStatus: string;
  type: string;
  data: { media_source: string; campaign: string; deep_link_value: string; is_deferred: boolean; sid: string };
  isDeferred: boolean;
}

export type DeepLinkHandler = (data: IAppsflyerDeepLinkData) => void;

type SuccessCB = (result?: any) => any;

class AppsFlyerService {
  isAppsFlyerSdkReady: Promise<boolean>;
  private deepLinkHandlerList: DeepLinkHandler[] = [];

  constructor(private logger: Logger) {
    this.initAppsFlyerServiceSDK();
  }

  /* istanbul ignore next */
  private initAppsFlyerServiceSDK() {
    this.isAppsFlyerSdkReady = new Promise(async resolve => {
      try {
        AppsFlyer.onDeepLink((data: UnifiedDeepLinkData) =>
          this.deepLinkHandlerList.forEach(handler => {
            this.logger.info('AppsFlyer onDeepLinking');
            this.logger.debug('AppsFlyer onDeepLinking', { data });
            handler(data as IAppsflyerDeepLinkData);
          })
        );

        const options = {
          devKey: ENV.APPSFLYER.DEV_KEY,
          appId: Platform.select({ ios: ENV.APPSFLYER.APP_ID_IOS, android: ENV.APPSFLYER.APP_ID_ANDROID }),
          isDebug: !ENV.IS_PROD,
          onInstallConversionDataListener: true,
          onDeepLinkListener: true
        };
        const initializationResponse = await AppsFlyer.initSdk(options);
        this.logger.info('AppsFlyer initialized', { initializationResponse });
        this.logger.debug('AppsFlyer initialized', { options, initializationResponse });
        resolve(true);
      } catch (error) {
        this.logger.error(error, { context: 'Error initializing AppsFlyer SDK' });
        resolve(false);
      }
    });
  }

  updateServerUninstallToken = (deviceToken: string) => {
    AppsFlyer.updateServerUninstallToken(deviceToken);
    this.logger.debug('AppsFlyer updated server uninstall token', { deviceToken });
  };

  trackConversionEvent = (eventName: ConversionEventType, eventData: object): void => {
    this.logger.info(`Appsflyer logging event ${eventName}`);
    AppsFlyer.logEvent(eventName, eventData)
      .then(() => {
        this.logger.debug(`Appsflyer logging event ${eventName}`, eventData);
      })
      .catch(error => {
        this.logger.error(error, { context: `Error logging event ${eventName}` });
      });
  };

  addDeepLinkEventListener = (handler: DeepLinkHandler): void => {
    this.deepLinkHandlerList = Array.from(new Set([...this.deepLinkHandlerList, handler]));
  };

  removeDeepLinkEventListener = (handler?: DeepLinkHandler): void => {
    this.deepLinkHandlerList = this.deepLinkHandlerList.filter(h => !!handler && h !== handler);
  };

  clearDeepLinkEventListener = (): void => {
    this.deepLinkHandlerList = [];
  };

  setCustomerUserId = (userId: string, successC?: SuccessCB): void => {
    return AppsFlyer.setCustomerUserId(userId, successC);
  };
}

export default AppsFlyerService;

import { Platform } from 'react-native';

import { ENV } from '../constants';
import { Logger } from '_services/Logger';

interface OneTrustNativeSDKInstance {}

export interface OneTrustNativeSDK {
  new (): OneTrustNativeSDKInstance;
  startSDK(
    storageLocation: string,
    domainIdentifier: string,
    languageCode: string,
    params: { [key: string]: string | { [key: string]: string } },
    autoShowBanner: boolean
  ): Promise<object>;
  showBannerUI(): void;
  setBroadcastAllowedValues(categories: string[]): void;
  listenForConsentChanges(category: string, callback: (category: string, consent: number) => void): void;
  stopListeningForConsentChanges(): void;
}

export const MARKETING_COOKIES_GROUP_ID = 'C0004';

export class CCPAService {
  private sdk: OneTrustNativeSDK;
  private sdkUrl: string;
  private sdkId: string;

  constructor(sdk: OneTrustNativeSDK, private platformDep: typeof Platform, private logger: Logger) {
    this.sdkUrl = this.platformDep.select({ ios: ENV.ONE_TRUST.IOS.URL, android: ENV.ONE_TRUST.ANDROID.URL });
    this.sdkId = this.platformDep.select({ ios: ENV.ONE_TRUST.IOS.ID, android: ENV.ONE_TRUST.ANDROID.ID });
    this.sdk = sdk;

    if (!sdk) {
      this.logger.error('CCPA SDK is not present');
      return;
    }
    this.startSDK();
  }

  async startSDK(): Promise<void> {
    const languageCode = 'en';
    const sdkParams = { countryCode: 'us', regionCode: 'ca' };
    return this.sdk
      .startSDK(this.sdkUrl, this.sdkId, languageCode, sdkParams, false)
      .then(initResult => {
        this.logger.info('OneTrust SDK started', { initResult });
        this.sdk.setBroadcastAllowedValues([MARKETING_COOKIES_GROUP_ID]);
      })
      .catch(err => {
        this.logger.error('OneTrust SDK failed to start', { err });
      });
  }

  showConsentBanner = async (): Promise<boolean> => {
    try {
      this.logger.info('Showing OneTrust consent banner');
      this.sdk.showBannerUI();

      return new Promise<boolean>((resolve, _reject) => {
        this.sdk.listenForConsentChanges(MARKETING_COOKIES_GROUP_ID, (category, consent) => {
          this.logger.debug('User consent changed', { category, consent });
          this.sdk.stopListeningForConsentChanges();
          resolve(consent === 1);
        });
      });
    } catch (error) {
      this.logger.error('Error showing CCPA banner', { error });
      return false;
    }
  };
}

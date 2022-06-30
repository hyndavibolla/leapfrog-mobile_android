// @ts-nocheck - workaround for used before its initialization on this file. Fixable by typescript future update? or refactor
import { Alert, AlertButton, AlertOptions, AlertType, Dimensions, Linking, AppState, NativeModules, Platform } from 'react-native';
import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import * as RNLocalize from 'react-native-localize';
import * as RNSha256 from 'react-native-sha256';
import RNRestart from 'react-native-restart';
import { FirebaseMessagingTypes, firebase } from '@react-native-firebase/messaging';
import CookieManager from '@react-native-cookies/cookies';
import Base64 from 'react-native-base64';
import * as ReactNativePermission from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import Clipboard from '@react-native-community/clipboard';

import { safeParse } from '../utils/safeParse';
import { ENV } from '../constants';
import { RUNTIME_ENV } from '../models/general';
import SailthruService from './SailthruService';

/** This service is meant to be use as an abstraction for everything external or "react native related" */
export class NativeHelperService {
  constructor(
    private alertDep: Alert,
    private secureStorageDep: typeof RNSecureKeyStore,
    private dimensionsDep: typeof Dimensions,
    private deviceInfoDep: typeof DeviceInfo,
    private netInfoDep: typeof NetInfo,
    private linkingDep: typeof Linking,
    private localizationDep: typeof RNLocalize,
    private appStateDep: typeof AppState,
    private nativeModulesDep: typeof NativeModules,
    private platformDep: typeof Platform,
    private messagingDep: FirebaseMessagingTypes.Module,
    private sha256Dep: typeof RNSha256,
    private restartDep: typeof RNRestart,
    private cookieManagerDep: typeof CookieManager,
    private base64Dep: typeof Base64,
    private firebaseAuthorizationStatusDep: typeof firebase.messaging.AuthorizationStatus,
    private sailthruService: SailthruService,
    private reactNativePermissionDep: typeof ReactNativePermission,
    private geolocationDep: typeof Geolocation,
    private clipboardDep: typeof Clipboard
  ) {
    this.dimensions.isSmallDevice = this.dimensionsDep.get('window').width < 360;
  }

  netInfo = {
    getState: () => this.netInfoDep.fetch(),
    subscribeToConnectionChanges: (callback: (isConnected: boolean) => void) => this.netInfoDep.addEventListener(info => callback(!!info?.isConnected)),
    waitForConnection: (): Promise<void> =>
      new Promise(async (resolve, reject) => {
        const netInfo = await this.netInfoDep.fetch();
        if (netInfo.isConnected) return resolve();
        const timeout = setTimeout(() => {
          reject(new Error(`Timeout on connection loss (${ENV.CONNECTION_LOSS_PAUSE_TIMEOUT / 1000} seconds)`));
          subscription();
        }, ENV.CONNECTION_LOSS_PAUSE_TIMEOUT);
        const subscription = this.netInfoDep.addEventListener(info => {
          if (!info?.isConnected) return;
          clearTimeout(timeout);
          resolve();
          setTimeout(() => subscription());
        });
      })
  };

  appState = {
    currentState: this.appStateDep.currentState,
    addEventListener: this.appStateDep.addEventListener.bind(AppState)
  };

  deviceInfo = {
    ...this.deviceInfoDep,
    ...this.localizationDep,
    getAppVersion: () => {
      return `${this.deviceInfoDep.getVersion()}.${this.deviceInfoDep.getBuildNumber()}`;
    },
    getDeviceModel: () => {
      return this.deviceInfoDep.getModel();
    },
    getDeviceLanguage: () => {
      const [preferredLocale] = this.localizationDep.getLocales();
      return preferredLocale?.languageTag || 'en-US';
    },
    getDeviceOsType: () => {
      const osMap = {
        ios: 'iOS',
        android: 'Android'
      };
      const osType = osMap[this.platformDep.OS];
      return osType ? osType : '';
    },
    getDeviceOsVersion: () => {
      return this.deviceInfoDep.getSystemVersion();
    },
    getDeviceTokenAsync: async () => {
      try {
        const deviceToken = await this.messagingDep.getAPNSToken();
        return deviceToken || '';
      } catch {
        return '';
      }
    },
    getFCMTokenAsync: async () => {
      try {
        return await this.messagingDep.getToken();
      } catch {}
    },
    onFCMTokenRefresh: (cb: (token: string) => void) => {
      this.messagingDep.onTokenRefresh(cb); // not returning to normalize since typing is inconsistent with documentation
    }
  } as typeof DeviceInfo &
    typeof RNLocalize & {
      getAppVersion: () => string;
      getDeviceModel: () => string;
      getDeviceLanguage: () => string;
      getDeviceOsType: () => Promise<string>;
      getDeviceOsVersion: () => string;
      getDeviceTokenAsync: () => Promise<string>;
      getFCMTokenAsync: () => Promise<string>;
      onFCMTokenRefresh: (cb: (token: string) => void) => void;
    };

  /** @todo refactor into its own StorageService */
  storage = {
    get: <T>(key: string): Promise<T | null> =>
      this.secureStorageDep
        .get(key)
        .then(safeParse as () => T)
        .catch(() => null),
    set: async <T>(key: string, value: T) => {
      await this.secureStorageDep.set(key, JSON.stringify(value), { accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY });
    },
    remove: async (key: string): Promise<boolean> => {
      try {
        await this.secureStorageDep.remove(key);
        return true;
      } catch {
        return false;
      }
    }
  };

  dimensions = {
    getWindowWidth: () => {
      return this.dimensionsDep.get('window').width;
    },
    getWindowHeight: () => {
      return this.dimensionsDep.get('window').height;
    },
    isSmallDevice: false
  };

  alert = {
    alert: (title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions) => {
      return this.alertDep.alert(title, message, buttons, options);
    },
    prompt: (
      title: string,
      message?: string,
      callbackOrButtons?: ((text: string) => void) | AlertButton[],
      type?: AlertType,
      defaultValue?: string,
      keyboardType?: string
    ) => {
      return this.alertDep.prompt(title, message, callbackOrButtons, type, defaultValue, keyboardType);
    }
  };

  linking = {
    openURL: (url: string) => this.linkingDep.openURL(url),
    canOpenURL: (url: string) => this.linkingDep.canOpenURL(url),
    checkURLScheme: (proto: string, query: string) => this.linkingDep.canOpenURL(`${proto}://${query}`),
    getInitialURL: () => this.linkingDep.getInitialURL(),
    addEventListener: (type: string, handler: (event: { url: string }) => void) => this.linkingDep.addEventListener(type, handler)
  };

  buttonSdk = {
    isConfigured: false,
    isUserIdSet: false,
    configure: (appId: string, debugEnabled: boolean = false) => {
      if (!this.buttonSdk.isConfigured) {
        this.nativeModulesDep.ButtonIntegration.configureSDK(appId, debugEnabled);
        this.buttonSdk.isConfigured = true;
      }
    },
    setUserId: (userId: string) => {
      if (!this.buttonSdk.isUserIdSet) {
        this.nativeModulesDep.ButtonIntegration.setIdentifier(userId);
        this.buttonSdk.isUserIdSet = true;
      }
    },
    clearData: () => this.nativeModulesDep.ButtonIntegration.clearAllData(),
    purchaseRequest: (url: string, offerId: string, publisherReference: string, onError: (request: string, purchasePath: string, error: any) => void) =>
      this.nativeModulesDep.ButtonIntegration.purchaseRequest(url, offerId, publisherReference, onError)
  };

  platform = this.platformDep;

  hash = {
    buildSHA256: this.sha256Dep.sha256 as (arg: string) => Promise<string>
  };

  restart = () => this.restartDep.Restart();

  cookieManager = {
    ...this.cookieManagerDep,
    clearAll: async (useWebKit?: boolean) => {
      try {
        const response = await this.cookieManagerDep.clearAll(useWebKit);
        return response;
      } catch {
        return false;
      }
    }
  };

  base64 = this.base64Dep;

  messaging = {
    hasPermission: () => this.messagingDep.hasPermission(),
    requestPermission: () => this.messagingDep.requestPermission()
  };

  pushNotificationsAuthStatus = this.firebaseAuthorizationStatusDep;

  getRuntimeEnv = async (): Promise<RUNTIME_ENV> => {
    const isTest = (await this.nativeModulesDep.ProdChecker.getRunningEnvironment()) === RUNTIME_ENV.DEV_TEST;
    return isTest ? RUNTIME_ENV.DEV_TEST : RUNTIME_ENV.LIVE;
  };

  sailthru = this.sailthruService;

  reactNativePermission = this.reactNativePermissionDep;
  geolocation = this.geolocationDep;
  clipboard = this.clipboardDep;
}

import { Alert, Dimensions, Linking, AppState, NativeModules, Platform } from 'react-native';
import RNAdvertisingId from 'react-native-advertising-id';
import Auth0 from 'react-native-auth0';
import base64 from 'react-native-base64';
import CookieManager from '@react-native-cookies/cookies';
import Clipboard from '@react-native-community/clipboard';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import crashlytics, { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics';
import remoteConfig from '@react-native-firebase/remote-config';
import { firebase } from '@react-native-firebase/messaging';
import perf from '@react-native-firebase/perf';
import Geolocation from 'react-native-geolocation-service';
import * as ReactNativePermission from 'react-native-permissions';
import * as RNLocalize from 'react-native-localize';
import RNRestart from 'react-native-restart';
import RNSecureKeyStore from 'react-native-secure-key-store';
import * as RNSha256 from 'react-native-sha256';
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';
import OTPublishersNativeSDK from 'react-native-onetrust-cmp';
import { ENV } from '_constants';
import { Deps, ICCPASetting, IGlobalState, ITokenSet } from '_models/general';
import { ApiService } from '_services/ApiService';
import { AppService } from '_services/AppService';
import { CCPAService } from '_services/CCPAService';
import CrashlyticsService from '_services/CrashlyticsService';
import { HttpService } from '_services/HttpService';
import { EventTrackerService } from '_services/EventTrackerService';
import { NativeHelperService } from '_services/NativeHelperService';
import { Logger } from '_services/Logger';
import { PerformanceTrackingService } from '_services/PerformanceTrackingService';
import { RaiseService } from '_services/RaiseService';
import { RemoteConfigService } from '_services/RemoteConfigService';
import SailthruService from '_services/SailthruService';
import { getStateSnapshotStorage } from '_utils/getStateSnapshotStorage';
import RZeroService from '_services/RZeroService';
import ForterSDKService from '_services/ForterSDKService';
import TealiumSDKService from '_services/TealiumSDKService';
import AppsFlyerService from '_services/AppsFlyerService';

export const getDeps = (): Deps => {
  const firebaseCrashlytics: FirebaseCrashlyticsTypes.Module = crashlytics();
  const crashlyticsService = new CrashlyticsService(firebaseCrashlytics);
  const sailthruService = new SailthruService();
  const nativeHelperService = new NativeHelperService(
    Alert,
    RNSecureKeyStore,
    Dimensions,
    DeviceInfo,
    NetInfo,
    Linking,
    RNLocalize,
    AppState,
    NativeModules,
    Platform,
    firebase.messaging(),
    RNSha256,
    RNRestart,
    CookieManager,
    base64,
    firebase.messaging.AuthorizationStatus,
    sailthruService,
    ReactNativePermission,
    Geolocation,
    Clipboard
  );
  const netInfo = nativeHelperService.netInfo;
  const tokenKey = ENV.STORAGE_KEY.TOKEN_SET;
  const persistTokenSet = (tokenSet: ITokenSet) => nativeHelperService.storage.set(tokenKey, tokenSet);
  const getTokenSet = () => nativeHelperService.storage.get<ITokenSet>(tokenKey);
  const getDeviceId = () => nativeHelperService.storage.get<string>(ENV.STORAGE_KEY.DEVICE_ID);
  const logger = new Logger(console, nativeHelperService.storage.get);
  const authService = new Auth0({
    domain: ENV.AUTH0.DOMAIN_ID,
    clientId: ENV.AUTH0.CLIENT_ID
  });
  const rZeroService = new RZeroService(logger);
  const forterSDKService = new ForterSDKService(logger);
  const tealiumSDKService = new TealiumSDKService(logger);
  const appsFlyerService = new AppsFlyerService(logger);

  const performanceTrackingService = new PerformanceTrackingService(perf(), fetch);
  const httpService = new HttpService(nativeHelperService.storage.get, performanceTrackingService.measuredFetch.bind(performanceTrackingService));
  const appService = new AppService(getDeviceId);
  const apiService = new ApiService(
    appService,
    RNAdvertisingId.getAdvertisingId,
    httpService,
    logger,
    crashlyticsService,
    persistTokenSet,
    getTokenSet,
    netInfo.waitForConnection,
    authService
  );
  const raiseService = new RaiseService(httpService, logger, crashlyticsService, netInfo.waitForConnection, nativeHelperService.hash.buildSHA256);
  const stateSnapshot = getStateSnapshotStorage<IGlobalState>();
  const cCPASetting = () => nativeHelperService.storage.get<ICCPASetting>(ENV.STORAGE_KEY.CCPA_SETTING);
  const eventTrackerService = new EventTrackerService(
    tealiumSDKService,
    appsFlyerService,
    sailthruService,
    forterSDKService,
    logger,
    getTrackingStatus,
    requestTrackingPermission,
    cCPASetting,
    rZeroService
  );
  const ccpaService = new CCPAService(OTPublishersNativeSDK, Platform, logger);
  const remoteConfigService = new RemoteConfigService(remoteConfig, logger);

  return {
    apiService,
    appService,
    authService,
    ccpaService,
    crashlyticsService,
    httpService,
    eventTrackerService,
    logger,
    nativeHelperService,
    stateSnapshot,
    performanceTrackingService,
    raiseService,
    remoteConfigService
  };
};

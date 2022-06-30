import React from 'react';
import { Alert, AppState, Dimensions, Linking, NativeModules, Platform } from 'react-native';
import RNAdvertisingId from 'react-native-advertising-id';
import Auth0 from 'react-native-auth0';
import base64 from 'react-native-base64';
import CookieManager from '@react-native-cookies/cookies';
import Clipboard from '@react-native-community/clipboard';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import * as RNLocalize from 'react-native-localize';
import * as ReactNativePermission from 'react-native-permissions';
import RNRestart from 'react-native-restart';
import * as RNSha256 from 'react-native-sha256';
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';

import { ENV } from '_constants';
import { IGlobalState } from '_models/general';
import { ApiService } from '_services/ApiService';
import { AppService } from '_services/AppService';
import { CCPAService } from '_services/CCPAService';
import { EventTrackerService } from '_services/EventTrackerService';
import { NativeHelperService } from '_services/NativeHelperService';
import { Logger } from '_services/Logger';
import { IPerformanceTrackingService } from '_services/PerformanceTrackingService';
import { RaiseService } from '_services/RaiseService';
import { RemoteConfigService } from '_services/RemoteConfigService';
import SailthruService from '_services/SailthruService';
import { combinedReducer, getInitialState, GlobalProvider } from '_state_mgmt/GlobalState';
import { getStateSnapshotStorage } from '_utils/getStateSnapshotStorage';
import RZeroService from '_services/RZeroService';
import { noop as nonAsyncNoop } from '_utils/noop';

class OneTrustMockClass {
  static startSDK = nonAsyncNoop;
  static showBannerUI = nonAsyncNoop;
  static listenForConsentChanges = nonAsyncNoop;
  static setBroadcastAllowedValues = nonAsyncNoop;
  static stopListeningForConsentChanges = nonAsyncNoop;
}

export const RenderGlobalContextWrapped = ({ children, initialState = undefined }) => {
  const noop: any = async () => null;
  const httpService = {
    fetch: noop
  };
  const sailthruService = new SailthruService();
  const nativeHelperService = new NativeHelperService(
    Alert,
    { get: noop, set: noop, remove: noop, setResetOnAppUninstallTo: noop },
    Dimensions,
    DeviceInfo,
    NetInfo,
    Linking,
    RNLocalize,
    AppState,
    NativeModules,
    Platform,
    { getToken: noop, getAPNSToken: noop, requestPermission: noop, onTokenRefresh: noop } as any,
    RNSha256,
    RNRestart,
    CookieManager,
    base64,
    { AUTHORIZED: 1, PROVISIONAL: 2 } as any,
    sailthruService,
    ReactNativePermission,
    Geolocation,
    Clipboard
  );
  const logger = new Logger(console, nativeHelperService.storage.get);
  const rZeroService = new RZeroService(logger);
  const stateSnapshot = getStateSnapshotStorage<IGlobalState>();
  const appService = new AppService(noop);
  const apiService = new ApiService(appService, RNAdvertisingId.getAdvertisingId, httpService, logger, null, noop, noop, noop, noop);
  const raiseService = new RaiseService(httpService, logger, null, Promise.resolve, noop);
  const eventTrackerService = new EventTrackerService(
    { initialize: noop, trackEvent: noop, trackView: noop } as any,
    { initSdk: noop, updateServerUninstallToken: noop } as any,
    {} as any,
    { setDevLogsEnabled: noop, getDeviceUniqueID: noop, trackNavigation: noop, trackActionWithJSON: noop } as any,
    logger,
    getTrackingStatus,
    requestTrackingPermission,
    {} as any,
    rZeroService
  );
  const ccpaService = new CCPAService(OneTrustMockClass, nativeHelperService.platform, logger);
  const remoteConfigService = new RemoteConfigService(
    (() => ({
      fetchAndActivate: noop,
      getValue: async key => ENV.REMOTE_CONFIG.DEFAULT_CONFIG[key],
      setDefaults: noop,
      setConfigSettings: noop
    })) as any,
    logger
  );
  const performanceTrackingService = {
    initialize: noop,
    measuredFetch: noop,
    setPerformanceCollectionEnabled: noop
  } as IPerformanceTrackingService;
  const authService = new Auth0({
    domain: ENV.AUTH0.DOMAIN_ID,
    clientId: ENV.AUTH0.CLIENT_ID
  });
  const crashlyticsService = {
    initialize: noop,
    log: noop,
    recordError: noop,
    setCrashlyticsCollectionEnabled: noop,
    setUserId: noop
  };

  const deps = {
    appService,
    apiService,
    httpService,
    crashlyticsService,
    raiseService,
    nativeHelperService,
    stateSnapshot,
    logger,
    eventTrackerService,
    ccpaService,
    performanceTrackingService,
    remoteConfigService,
    authService
  };

  return (
    <GlobalProvider deps={deps} initState={initialState || getInitialState()} combinedReducers={combinedReducer}>
      {children}
    </GlobalProvider>
  );
};

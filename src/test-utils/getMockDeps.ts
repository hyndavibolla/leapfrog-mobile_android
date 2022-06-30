import { ENV } from '_constants';
import { GeneralModel, MissionModel } from '_models';
import { RUNTIME_ENV } from '_models/general';
import { ICrashlyticsService } from '_services/CrashlyticsService';
import { IHttpService } from '_services/HttpService';
import { IPerformanceTrackingService } from '_services/PerformanceTrackingService';
import { getInitialState } from '_state_mgmt/GlobalState';
import {
  getUser,
  getGame,
  getActivity_1,
  getActivity_2,
  getActivity_3,
  getMissionCategory_1,
  getMissionCategory_2,
  getMissionCategory_3,
  getMissionKeyword_1,
  getMissionKeyword_2,
  getMissionKeyword_3,
  getMission_1,
  getRewardConfig_1,
  getSlideObject_1,
  getSlideObject_2,
  getSlideCategoryIdList,
  getStreak_1,
  getQuestion_1,
  getQuestion_2,
  getQuestion_3,
  getAnswer_1,
  getAnswer_2,
  getAnswer_3,
  getNewOnMaxMessage_1,
  getNewOnMaxMessage_2,
  getNewOnMaxMessage_3,
  getSailthruMessage_1,
  getLinkedCards_1,
  getLinkedCards_2,
  getLinkedCards_3,
  getLinkedCards_4,
  getNewOnMaxMessage_4,
  getGiftCard,
  getGiftCardDetail,
  getGiftCardBalance
} from '_test_utils/entities';
import { createUUID } from '_utils/create-uuid';

export const getMockDeps = (initialStateGetter = getInitialState): GeneralModel.Deps => ({
  apiService: {
    isTokenInvalid: false,
    getDeviceIdAsync: async () => createUUID(),
    isTokenSetCurrentlyReady: () => true,
    setTokenSet: jest.fn(),
    authenticate: jest
      .fn()
      .mockResolvedValue({ accessToken: 'accessToken', refreshToken: 'refreshToken', accessTokenExpiryTime: 'accessTokenExpiryTime', deviceId: 'deviceId' }),
    enrollCard: jest.fn().mockResolvedValue(undefined),
    fetchRefId: jest.fn().mockResolvedValue('test-ref-id'),
    fetchUserProfile: jest.fn().mockResolvedValue(getUser()),
    fetchGameState: jest.fn().mockResolvedValue(getGame()),
    fetchRewardConfig: jest.fn().mockResolvedValue(getRewardConfig_1()),
    fetchActivityHistory: jest.fn().mockResolvedValue([getActivity_1(), getActivity_2(), getActivity_3()]),
    fetchGiftCardList: jest.fn().mockResolvedValue([getGiftCard()]),
    fetchGiftCardDetail: jest.fn().mockResolvedValue(getGiftCardDetail()),
    fetchGiftCardBalance: jest.fn().mockResolvedValue(getGiftCardBalance()),
    fetchWalletStats: jest.fn().mockResolvedValue({
      totalLifetimeEarnedPoints: 15550,
      monthlySummaries: {
        '2020-02': 1500,
        '2020-03': 2000,
        '2020-04': 100,
        '2020-05': 950,
        '2020-06': 1000,
        '2020-07': 1500
      }
    }),
    fetchMissionCategoryList: jest.fn().mockResolvedValue([getMissionCategory_1(), getMissionCategory_2(), getMissionCategory_3()]),
    fetchMissionKeywordList: jest.fn().mockResolvedValue({
      [MissionModel.KeywordType.CATEGORY]: [getMissionKeyword_1().value],
      [MissionModel.KeywordType.BRAND]: [getMissionKeyword_2().value, getMissionKeyword_3().value]
    }),
    fetchMissionList: jest.fn(async ({ listType }) => ({ userId: 'buttonId', missions: [getMission_1()], title: 'mission endpoint title', listType })),
    registerDeviceInfo: jest.fn(),
    registerUserActivity: jest.fn(),
    logout: jest.fn(),
    getSYWOnlineToken: jest.fn().mockResolvedValue('test-token'),
    sendValidationEmail: jest.fn().mockResolvedValue(undefined),
    fetchStreakList: jest.fn().mockResolvedValue([getStreak_1()]),
    fetchPromptList: jest.fn().mockResolvedValue({
      promptQuestions: [getQuestion_1(), getQuestion_2(), getQuestion_3()],
      answeredQuestions: [getAnswer_1(), getAnswer_2(), getAnswer_3()]
    }),
    updatePromptList: jest.fn(),
    unregisterDeviceInfo: jest.fn(),
    fetchLinkedCardsList: jest.fn().mockResolvedValue({ linkedCards: [getLinkedCards_1(), getLinkedCards_2(), getLinkedCards_3(), getLinkedCards_4()] }),
    activateLocalOffer: jest.fn(),
    fetchAppleWalletPass: jest.fn().mockResolvedValue('test-pass'),
    updateCardStatus: jest.fn()
  } as any,
  appService: {
    getDeviceIdAsync: async () => createUUID()
  } as any,
  crashlyticsService: {
    initialize: jest.fn(),
    log: jest.fn(),
    recordError: jest.fn(),
    setCrashlyticsCollectionEnabled: jest.fn()
  } as ICrashlyticsService,
  httpService: {
    fetch: jest.fn()
  } as IHttpService,
  performanceTrackingService: {
    initialize: jest.fn(),
    measuredFetch: jest.fn(),
    setPerformanceCollectionEnabled: jest.fn()
  } as IPerformanceTrackingService,
  raiseService: {
    fetchSlideBrand: jest.fn().mockResolvedValue([getSlideObject_1(), getSlideObject_2()]),
    fetchSlideCategoryIdList: jest.fn().mockResolvedValue(getSlideCategoryIdList())
  } as any,
  nativeHelperService: {
    alert: {
      alert: jest.fn(),
      prompt: jest.fn()
    },
    appState: { addEventListener: jest.fn(), currentState: 'active' },
    storage: {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(null),
      remove: jest.fn().mockResolvedValue(null)
    },
    clipboard: {
      getString: jest.fn(),
      setString: jest.fn()
    },
    dimensions: {
      getWindowWidth: jest.fn().mockReturnValue(750),
      getWindowHeight: jest.fn().mockReturnValue(1000),
      isSmallDevice: false
    },
    deviceInfo: {
      getDeviceId: createUUID,
      getUniqueId: createUUID,
      getVersion: () => '0.0',
      getBuildNumber: () => '0.1',
      getDeviceModel: () => 'iPhone 11',
      getLocales: { languageTag: 'en-US' },
      getBaseOs: async () => 'iOS',
      getSystemVersion: () => '11.0',
      getDeviceToken: () => createUUID(),
      getDeviceTokenAsync: async () => createUUID(),
      getDeviceOsType: async () => 'iOS',
      getAppVersion: () => '0.0.0.1',
      getDeviceLanguage: () => 'en-US',
      getDeviceOsVersion: () => '11.0',
      getFCMTokenAsync: async () => createUUID(),
      getTimeZone: () => 'testing-timezone',
      getReadableVersion: () => '1.1.1.1',
      onFCMTokenRefresh: jest.fn()
    },
    netInfo: {
      getState: jest.fn().mockResolvedValue({ isConnected: true }),
      subscribeToConnectionChanges: jest.fn(),
      waitForConnection: jest.fn().mockResolvedValue(undefined)
    },
    linking: {
      openURL: jest.fn(() => Promise.resolve()),
      canOpenURL: jest.fn(),
      checkURLScheme: jest.fn().mockResolvedValue(true),
      getInitialURL: jest.fn(),
      addEventListener: jest.fn()
    },
    buttonSdk: {
      configure: jest.fn(),
      setUserId: jest.fn(),
      clearData: jest.fn(),
      purchaseRequest: jest.fn()
    },
    platform: {
      os: 'default',
      select: jest.fn(config => config?.default)
    },
    fireBaseMessaging: {
      getToken: jest.fn().mockReturnValue(createUUID())
    },
    hash: {
      buildSHA256: jest.fn().mockResolvedValue('hash')
    },
    restart: jest.fn(),
    cookieManager: {
      clearAll: jest.fn()
    },
    base64: {
      encode: jest.fn((...args) => `b64 encoded: ${JSON.stringify(args)}`),
      decode: jest.fn((...args) => `b64 decoded: ${JSON.stringify(args)}`)
    },
    getRuntimeEnv: jest.fn().mockResolvedValue(RUNTIME_ENV.DEV_TEST),
    messaging: {
      hasPermission: jest.fn().mockReturnValue(true),
      requestPermission: jest.fn()
    },
    pushNotificationsAuthStatus: {
      NOT_DETERMINED: -1,
      DENIED: 0,
      AUTHORIZED: 1,
      PROVISIONAL: 2
    },
    sailthru: {
      getMessages: jest
        .fn()
        .mockResolvedValue([getNewOnMaxMessage_1(), getNewOnMaxMessage_4(), getNewOnMaxMessage_2(), getNewOnMaxMessage_3(), getSailthruMessage_1()]),
      markMessageAsRead: jest.fn().mockResolvedValue(true),
      getInitialNotification: jest.fn(),
      onNotificationTapped: jest.fn(cb => {
        cb({});
        return () => {};
      }) as any
    },
    reactNativePermission: require('react-native-permissions/mock'),
    geolocation: {
      addListener: jest.fn(),
      getCurrentPosition: jest.fn(),
      removeListeners: jest.fn(),
      requestAuthorization: jest.fn(),
      setConfiguration: jest.fn(),
      startObserving: jest.fn(),
      stopObserving: jest.fn()
    }
  } as any,
  stateSnapshot: {
    set: jest.fn(),
    get: jest.fn().mockReturnValue(initialStateGetter())
  },
  logger: {
    log: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
    color: jest.fn(),
    assert: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    format: jest.fn()
  } as any,
  eventTrackerService: {
    trackDataUser: jest.fn(),
    isTrackingEnabled: jest.fn().mockResolvedValue(true),
    rZero: {
      trackView: jest.fn(),
      trackEvent: jest.fn(),
      flush: jest.fn(),
      setUser: jest.fn()
    },
    forterSDK: {
      setDevLogsEnabled: jest.fn(),
      getDeviceUniqueID: jest.fn(cb => cb()),
      init: jest.fn((a, b, c) => c()),
      trackNavigation: jest.fn(),
      trackNavigationWithExtraData: jest.fn(),
      trackAction: jest.fn(),
      trackActionWithJSON: jest.fn(),
      fraudTrackNavigationEvent: jest.fn(),
      fraudTrackAction: jest.fn()
    },
    tealiumSDK: {
      track: jest.fn(),
      trackView: jest.fn()
    },
    appsFlyerSDK: {
      updateServerUninstallToken: jest.fn(),
      setCustomerUserId: jest.fn().mockImplementation((_, cb) => cb('success')),
      addDeepLinkEventListener: jest.fn(),
      removeDeepLinkEventListener: jest.fn(),
      clearDeepLinkEventListener: jest.fn(),
      trackConversionEvent: jest.fn()
    }
  } as any,
  ccpaService: {
    showConsentBanner: jest.fn().mockResolvedValue(null),
    showPreferenceCenter: jest.fn()
  } as any,
  remoteConfigService: {
    getValue: jest.fn(async key => ENV.REMOTE_CONFIG.DEFAULT_CONFIG[key]),
    fetchAndActivate: jest.fn().mockResolvedValue(null)
  } as any,
  authService: {
    auth: {
      refreshToken: jest.fn().mockResolvedValue(true)
    },
    webAuth: {
      authorize: jest.fn(),
      clearSession: jest.fn()
    }
  } as any
});

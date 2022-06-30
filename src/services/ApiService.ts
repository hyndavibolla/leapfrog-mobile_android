/* istanbul ignore file */
/**
 * Ignoring this file for testing because we don't want to test every endpoint (configuration).
 * We will, however test methods and behaviors such as placing the token in each call, waiting for connection to be regained, etc when they are available.
 */
import Auth0 from 'react-native-auth0';

import { ENV } from '_constants';
import { UserModel, GameModel, ActivityModel, OfferModel, MissionModel, RewardModel, StreakModel, PromptModel } from '_models';
import { ICardLinkOffers, ILinkedCard, EnrollmentEventType, IGeocodeAddress, IGeocodePlace, IGeocodePlaceDetails } from '_models/cardLink';
import { HTTP_METHOD, ITokenSet, DateLike } from '_models/general';
import { IGiftCard, IGiftCardDetail, IGiftCardBalance, IGiftCardStatus } from '_models/giftCard';
import { AppService } from '_services/AppService';
import { ICrashlyticsService } from '_services/CrashlyticsService';
import { Logger, LogMethod } from '_services/Logger';
import { blobToBase64 } from '_utils/blobToBase64';
import { createUUID } from '_utils/create-uuid';
import { IHttpService } from '_services/HttpService';
import { memorize } from '_utils/memorize';
import { retryRequest } from '_utils/retryRequest';
import { noop } from '_utils/noop';

export enum UserActivityType {
  SYWM_CARD = 'sywmCard',
  MAX_ONBOARDING = 'maxOnboarding'
}

export enum UserActivityId {
  SYWM_APPLIED = 'sywmApplied',
  USER_ONBOARDED = 'userOnboarded'
}

export interface IUserActivityDetail {
  activityId: UserActivityId;
  attributes?: Record<string, any>;
}

export enum SYWApplication {
  SLIDE = 'slide'
}

interface fetchMissionListProps {
  listType: MissionModel.MissionListType;
  category?: string /** either use this one */;
  brandName?: string /** or this one, but not both */;
  limit?: number;
  offset?: number;
  keyword?: string;
  rewardOfferCode?: string;
  brandRequestorId?: string | string[];
  programType?: string;
}

interface fetchActivityHistoryProps {
  to?: DateLike;
  from: DateLike;
  rewardOfferCode?: string;
  cardId?: string;
  requestorId?: string;
}

export interface IFetchLocalOffersParameters {
  latitude?: number;
  longitude?: number;
  zip?: number;
  limit?: number;
  offset?: number;
  merchantName?: string;
  dataShouldBePersisted?: boolean;
}

interface IAndroidPass {
  saveUri: string;
}

export enum BackEndUrls {
  AUTHENTICATE = '/oauth/v4/auth',
  REGISTER_DEVICE_INFO = '/devices/v4/info',
  UNREGISTER_DEVICE_INFO = '/devices/v4/unregister',
  REGISTER_USER_ACTIVITY = '/user/v4/activity',
  GET_SYW_ONLINE_TOKEN = '/syw/v4/auth/token',
  USER_PROFILE = '/user/v4/me/profile',
  MISSION_CATEGORY_LIST = '/missions/v4/categories',
  MISSION_LIST = '/missions/v4/list',
  MISSION_KEYWORD_LIST = '/missions/v4/search',
  REWARD_CONFIG = '/rewards/v5/config',
  GAME_STATE = '/user/v5/gameState',
  STREAK_LIST = '/streaks/v4/list',
  ACTIVITY_HISTORY = '/wallet/v4/activities',
  SEND_VALIDATION_EMAIL = '/user/v4/me/validationEmail',
  PROMPT_LIST = '/prompts/v4/list',
  UPDATE_PROMPT_LIST = '/prompts/v4/update',
  REFRESH_TOKEN = '/invalid/v4/url',
  GET_LOCAL_OFFERS = '/cardlink/v4/offers',
  GET_ENROLLED_CARDS = '/cardlink/v4/list',
  GEOCODING_ADDRESS = '/integrations/v4/geocoding',
  ACTIVATE_LOCAL_OFFER = '/cardlink/v4/activateOffer',
  ENROLLMENT_CARD = '/cardlink/v4/enrollment',
  CHECKOUT_REF_ID = '/checkout/v5/refid',
  GET_GIFT_CARD_LIST = '/rewards/v5/giftCardList',
  GET_GIFT_CARD_DETAIL = '/rewards/v5/card',
  GET_GIFT_CARD_BALANCE = '/rewards/v5/cardBalance',
  GET_PLACE_AUTOCOMPLETE = '/integrations/v4/place/autocomplete/json',
  GET_PLACE_DETAILS = '/integrations/v4/place/details/json',
  GET_APPLE_PASS = '/wallet/v5/pass/apple',
  GET_ANDROID_PASS = '/wallet/v5/pass/google',
  SET_GIFT_CARD_STATUS = '/rewards/v5/cardStatus'
}

export const ZEROED_UUID = '00000000-0000-0000-0000-000000000000';

export class ApiService {
  constructor(
    private appService: AppService,
    private getAdvertisingId: () => Promise<{ advertisingId: string }>,
    private httpService: IHttpService,
    private logger: Logger,
    private crashlyticsService: ICrashlyticsService,
    private persistTokenSet: (tokenSet: ITokenSet) => Promise<void>,
    private getTokenSet: () => Promise<ITokenSet>,
    private waitForConnection: () => Promise<void>,
    private authService: Auth0
  ) {}

  private advertisingId?: string;
  private apiUrl: string = ENV.API.URL;
  private tokenSet: ITokenSet;
  private deviceId: string;
  private _isTokenInvalid: boolean = false;
  private _isOngoingRefresh: boolean = false;
  get isTokenInvalid() {
    return this._isTokenInvalid;
  }

  private intervals = {
    clearGameStateInterval: noop,
    clearStreakListInterval: noop
  };

  urls = BackEndUrls;

  clearIntervals = (): void => {
    this.intervals.clearGameStateInterval();
    this.intervals.clearStreakListInterval();
  };

  isTokenSetCurrentlyReady = (): boolean => {
    return !!(this.tokenSet && this.tokenSet?.accessToken && this.tokenSet?.accessTokenExpiryTime && this.tokenSet?.refreshToken && this.deviceId);
  };

  fetchAdvertisingId = async () => {
    return (
      this.advertisingId ||
      (await (async () => {
        try {
          this.advertisingId = (await this.getAdvertisingId()).advertisingId;
          return this.advertisingId || ZEROED_UUID;
        } catch (e) {
          this.logger.error(e, { context: 'Problem retrieving advertising ID' });
          return ZEROED_UUID;
        }
      })())
    );
  };

  getTokenSetAsync = async (): Promise<ITokenSet> => {
    const tokenSet = this.tokenSet || (await this.getTokenSet());

    if (tokenSet && !tokenSet.expiresIn) {
      this.persistTokenSet(null);
      return null;
    }

    return tokenSet;
  };

  setTokenSet = async (tokenSet: ITokenSet, deviceId: string) => {
    if (!tokenSet?.accessToken || !tokenSet?.accessTokenExpiryTime || !tokenSet?.refreshToken || !deviceId) {
      this.logger.error('Attempted to set an invalid tokenSet. Setting token as invalid', { tokenSet, deviceId });
      this._isTokenInvalid = true;
      throw { json: async () => ({ tokenSet }), status: 400 };
    }
    this.logger.debug('Setting token', { tokenSet });
    this.tokenSet = tokenSet;

    this.logger.debug('Setting deviceId', { deviceId });
    this.deviceId = deviceId;

    await this.persistTokenSet(tokenSet);
  };

  registerDeviceInfo = async (
    deviceToken: string,
    timeZone: string,
    appVersion: string,
    deviceModel: string,
    language: string,
    osType: string,
    osVersion: string,
    fcmToken: string
  ): Promise<void> => {
    const deviceId = await this.appService.getDeviceIdAsync();

    this.logger.assert(LogMethod.WARN, !deviceId, `deviceId is falsy (${deviceId})`);

    return this.request<void>(
      this.urls.REGISTER_DEVICE_INFO,
      { deviceToken, deviceId, timeZone, appVersion, deviceModel, language, osType, osVersion, fcmToken },
      HTTP_METHOD.POST
    );
  };

  unregisterDeviceInfo = async (): Promise<void> => {
    const deviceId = await this.appService.getDeviceIdAsync();
    this.logger.assert(LogMethod.WARN, !deviceId, `deviceId is falsy (${deviceId})`);
    return this.request<void>(this.urls.UNREGISTER_DEVICE_INFO, { deviceId }, HTTP_METHOD.POST);
  };

  registerUserActivity = async (deviceIds: string[], userActivityType: UserActivityType, userActivityDetails: IUserActivityDetail[]): Promise<void> => {
    return this.request<void>(
      this.urls.REGISTER_USER_ACTIVITY,
      { deviceIds, activityType: userActivityType, activityDetails: userActivityDetails },
      HTTP_METHOD.POST
    );
  };

  getSYWOnlineToken = async (application: SYWApplication): Promise<string> => {
    return this.request<any>(this.urls.GET_SYW_ONLINE_TOKEN, { application }, HTTP_METHOD.POST).then(({ token }) => token);
  };

  fetchUserProfile = async (): Promise<UserModel.IUser> => {
    return this.request<UserModel.IUser>(this.urls.USER_PROFILE);
  };

  fetchMissionCategoryList = async (): Promise<MissionModel.ICategory[]> => {
    return this.request<{ categories: MissionModel.ICategory[] }>(this.urls.MISSION_CATEGORY_LIST).then(({ categories }) => categories);
  };

  fetchMissionList = async ({
    listType,
    category,
    brandName,
    limit,
    offset,
    keyword,
    rewardOfferCode,
    brandRequestorId,
    programType
  }: fetchMissionListProps): Promise<{ userId?: string; missions?: MissionModel.IMission[]; title?: string; listType?: MissionModel.MissionListType }> => {
    const advertisingId = await this.fetchAdvertisingId();

    const { userId, missions, title } = await this.request<{ userId?: string; missions?: MissionModel.IMission[]; title: string }>(this.urls.MISSION_LIST, {
      listType,
      limit,
      offset,
      category,
      brandName,
      keyword,
      rewardOfferCode,
      advertisingId,
      brandRequestorId,
      programType
    }).then(result => ({
      ...result,
      missions: (result.missions || []).map(m => ({ ...m, brandCategories: m.brandCategories || [], uuid: `${m.offerCode};${m.offerId}` }))
    }));
    return { userId, missions, title, listType };
  };

  fetchMissionKeywordList = memorize(async (): Promise<Record<MissionModel.KeywordType, string[]>> => {
    const keywords = await this.request<{ keywords: MissionModel.IKeyword[] }>(this.urls.MISSION_KEYWORD_LIST).then(
      ({ keywords: retrievedKeywords }) => retrievedKeywords
    );
    const keywordMap = keywords.reduce((total, { value, type }) => {
      if (!total[type]) return total;
      return { ...total, [type]: [...total[type], value] };
    }, Object.values(MissionModel.KeywordType).reduce((total, key) => ({ ...total, [key]: [] }), {} as any) as Record<MissionModel.KeywordType, string[]>);
    return Object.entries(keywordMap).reduce(
      (total, [key, list]) => ({ ...total, [key]: list.sort((a, b) => a.localeCompare(b)) }),
      {} as Record<MissionModel.KeywordType, string[]>
    );
  });

  fetchRewardConfig = memorize(async (): Promise<RewardModel.IRewardConfig> => {
    return this.request<RewardModel.IRewardConfig>(this.urls.REWARD_CONFIG).then(config => ({
      ...config,
      categories: config.categories.sort((a, b) => {
        if (a.id === ENV.CUSTOM_BRAND_CATEGORY_KEY) return -1;
        if (b.id === ENV.CUSTOM_BRAND_CATEGORY_KEY) return 1;
        return 0;
      })
    }));
  });

  /** force: true to call the api without cache */
  fetchGameState = (() => {
    const [fn, clearGameStateCache] = memorize(
      async (cacheKey?: number): Promise<GameModel.IGame> => {
        this.logger.debug(`game state fetched using cache key ${cacheKey}`);
        return this.request<GameModel.IGame>(this.urls.GAME_STATE).then(res => ({ ...res, lastUpdatedAt: Date.now() }));
      },
      1,
      ENV.API.CACHE.GAME_STATE_MS
    );
    this.intervals.clearGameStateInterval = clearGameStateCache;
    let lastKey = Date.now();
    return (force?: boolean) => {
      this.logger.debug(`calling the game state API ${!force ? 'NOT' : ''} flushing cache`);
      if (force) lastKey = Date.now();
      return fn(lastKey);
    };
  })();

  /** force: true to call the api without cache */
  fetchStreakList = (() => {
    const [fn, clearStreakListCache] = memorize(
      async (cacheKey?: number): Promise<StreakModel.IStreak[]> => {
        this.logger.debug(`streak list fetched using cache key ${cacheKey}`);
        return this.request<{ offers: StreakModel.IStreak[] }>(this.urls.STREAK_LIST).then(({ offers }) => offers);
      },
      1,
      ENV.API.CACHE.STREAK_LIST_MS
    );
    this.intervals.clearStreakListInterval = clearStreakListCache;
    let lastKey = Date.now();
    return (force?: boolean) => {
      this.logger.debug(`calling the streak list API ${!force ? 'NOT' : ''} flushing cache`);
      if (force) lastKey = Date.now();
      return fn(lastKey);
    };
  })();

  fetchActivityHistory = async ({ to, from, rewardOfferCode, cardId, requestorId }: fetchActivityHistoryProps): Promise<ActivityModel.IActivity[]> => {
    const activityList: (ActivityModel.IActivity & { offers: OfferModel.IOffer[] })[] = await this.request<any>(this.urls.ACTIVITY_HISTORY, {
      from: from && new Date(from).toJSON(),
      to: to && new Date(to).toJSON(),
      rewardOfferCode,
      cardId,
      requestorId
    }).then(({ activities }) => activities || []);
    return activityList;
  };

  fetchGiftCardList = async (): Promise<{ giftCards: IGiftCard[] }> => await this.request(this.urls.GET_GIFT_CARD_LIST, {}, HTTP_METHOD.GET);

  fetchGiftCardDetail = async (id: string): Promise<IGiftCardDetail> => {
    return await this.request(this.urls.GET_GIFT_CARD_DETAIL, { id }, HTTP_METHOD.GET);
  };

  fetchGiftCardBalance = async (id: string): Promise<IGiftCardBalance> => {
    return await this.request(this.urls.GET_GIFT_CARD_BALANCE, { id }, HTTP_METHOD.GET);
  };

  fetchRefId = async (): Promise<string> => {
    return this.request<any>(this.urls.CHECKOUT_REF_ID, null, HTTP_METHOD.POST).then(({ refid }) => refid);
  };

  sendValidationEmail = async (): Promise<void> => {
    await this.request<void>(this.urls.SEND_VALIDATION_EMAIL, null, HTTP_METHOD.POST);
  };

  fetchPromptList = async (
    promptGroupName: PromptModel.QuestionGroupName,
    maxPOSPrompt: number = 99 /** @todo is this relevant? */,
    includeAnswersFlag: 'Y' | 'N' = 'Y'
  ): Promise<{ promptQuestions: PromptModel.IQuestion[]; answeredQuestions: PromptModel.IAnswer[] }> => {
    return this.request<{ promptQuestions: PromptModel.IQuestion[]; answeredQuestions: PromptModel.IAnswer[] }>(this.urls.PROMPT_LIST, {
      promptGroupName,
      maxPOSPrompt,
      includeAnswersFlag
    }).then(({ promptQuestions, answeredQuestions }) => ({
      promptQuestions: promptQuestions.map(i => ({ ...i, promptGroupName })),
      answeredQuestions: answeredQuestions.map(q => ({ ...q, promptGroupName }))
    }));
  };

  updatePromptList = async (promptQuestions: PromptModel.IQuestion[]): Promise<void> => {
    await this.request(this.urls.UPDATE_PROMPT_LIST, { promptQuestions }, HTTP_METHOD.POST);
  };

  fetchLocalOffers = async ({ latitude, longitude, zip, limit, offset, merchantName }: IFetchLocalOffersParameters): Promise<ICardLinkOffers> => {
    if (!(!!latitude && !!longitude)) {
      this.logger.error('Attempting to retrieve local offers with invalid parameters', latitude, longitude);
      return null;
    }

    return await this.request(this.urls.GET_LOCAL_OFFERS, { latitude, longitude, zip, limit, offset, merchantName }, HTTP_METHOD.GET);
  };

  fetchLinkedCardsList = async (): Promise<{ linkedCards: ILinkedCard[] }> => await this.request(this.urls.GET_ENROLLED_CARDS, {}, HTTP_METHOD.GET);

  geocodeAddress = async (address: string): Promise<IGeocodeAddress[]> => {
    const { results = [] } = await this.request(this.urls.GEOCODING_ADDRESS, { address, components: 'country:US' }, HTTP_METHOD.GET);
    return results;
  };

  fetchPlaceAutocomplete = async (input: string, sessiontoken: string, location: string): Promise<IGeocodePlace> => {
    if (!input) return null;
    return await this.request(
      this.urls.GET_PLACE_AUTOCOMPLETE,
      { input, sessiontoken, location, types: '(regions)', components: 'country:US' },
      HTTP_METHOD.GET
    );
  };

  fetchPlaceDetails = async (place_id: string, sessiontoken: string): Promise<IGeocodePlaceDetails> => {
    return await this.request(
      this.urls.GET_PLACE_DETAILS,
      { place_id, sessiontoken, fields: 'name,geometry/location,place_id,address_components,formatted_address' },
      HTTP_METHOD.GET
    );
  };

  activateLocalOffer = async (offerId: string): Promise<void> => {
    await this.request(this.urls.ACTIVATE_LOCAL_OFFER, { offerId }, HTTP_METHOD.POST);
  };

  enrollCard = async ({ eventType, programDetail }: { eventType: EnrollmentEventType; programDetail: ILinkedCard }): Promise<void> =>
    await this.request(this.urls.ENROLLMENT_CARD, { eventType, programDetails: { programDetail: [programDetail] } }, HTTP_METHOD.POST);

  fetchAppleWalletPass = async (giftCardId: string) => await this.request(this.urls.GET_APPLE_PASS, { giftCardId }, HTTP_METHOD.POST);

  fetchAndroidWalletPass = async (giftCardId: string): Promise<IAndroidPass> =>
    await this.request(this.urls.GET_ANDROID_PASS, { giftCardId }, HTTP_METHOD.POST);

  private request = async <T>(path: string, payload: Record<string, any> = {}, method: HTTP_METHOD = HTTP_METHOD.GET): Promise<T> => {
    await this.waitForConnection();

    if (await this.shouldRefreshToken()) await this.refreshToken();
    const requestId = createUUID();
    const queryParams =
      method === HTTP_METHOD.GET &&
      `?${Object.entries(payload)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')}`;
    const body = [HTTP_METHOD.POST, HTTP_METHOD.PUT, HTTP_METHOD.PATCH].includes(method) ? JSON.stringify(payload) : undefined;
    const startedAt = Date.now();
    const getOptions = async () => {
      const tokenSet = await this.getTokenSetAsync();

      this.logger.assert(LogMethod.WARN, !tokenSet?.accessToken, `accessToken is falsy (${tokenSet?.accessToken})`, { tokenSet });

      if (!tokenSet?.accessToken || !tokenSet.accessTokenExpiryTime || !tokenSet.refreshToken || !tokenSet.expiresIn) {
        this._isTokenInvalid = true;
        this.logger.error('Error creating request (setting token as invalid)', { tokenSet, path, payload, method });
        throw { json: async () => ({ tokenSet, path, payload, method }), status: 400 };
      }

      return {
        method,
        body,
        headers: {
          Authorization: `Bearer ${tokenSet?.accessToken}`,
          'Content-Type': 'application/json',
          'X-Http-Request-Id': requestId,
          sec: '0'
        }
      };
    };

    const fullPath = `${this.apiUrl}${path}${queryParams || ''}`;
    const attemptsLeft = ENV.API.API_RETRY_REQUEST_ATTEMPTS + 1; /** One attempt and the others are the retries */
    const onSuccess = async (response: Response) => {
      if (response.headers && response.headers.get('Content-Type') !== 'application/json') {
        const responseBlob = await response.blob();
        const encodedResponse = await blobToBase64(responseBlob);
        return encodedResponse;
      }
      const parsedRaw = await response.json();
      const parsedResponse = parsedRaw?.value;
      const options = await getOptions();

      /** these success (2xx and 3xx) responses are considered and mapped as errors */
      if ([3050, 3051, 3052, 3053].includes(parsedRaw?.error?.code)) {
        throw { json: async () => parsedRaw, status: 401, originalStatusCode: response.status };
      }
      if ((!parsedResponse && options?.method === HTTP_METHOD.GET) || !!parsedRaw?.resultCode) {
        throw { json: async () => parsedRaw, status: 503, originalStatusCode: response.status };
      }

      this.logger.info(`MBE response to ${options.method} ${fullPath}: HTTP ${response?.status}`);
      this.logger.debug(`(MBE) Response to ${options.method} ${fullPath}`, {
        duration: Date.now() - startedAt,
        requestId,
        parsedResponse,
        options,
        fullPath
      });
      return parsedResponse;
    };
    const onImmediateError = async (errorResponse: any) => {
      const tokenSet = await this.getTokenSetAsync();
      const requestResponseTimestamp = Date.now();
      const error = await errorResponse.json();
      const errorBody = error?.error ?? error;
      const options = await getOptions();
      const mappedStatusCode = errorResponse.status;
      const apiResponseStatusCode = errorResponse.originalStatusCode || errorResponse.status;
      const appResponseStatusCode = errorResponse.originalStatusCode ? errorResponse.status : '';

      const apiCallContext = {
        accessToken: tokenSet?.accessToken,
        apiUrl: fullPath,
        apiRequestBody: options?.body,
        apiSentTime: startedAt,
        apiResponseTime: requestResponseTimestamp,
        apiResponseStatusCode,
        apiResponseContent: errorBody,
        appResponseStatusCode
      };
      this.crashlyticsService.recordError(errorBody instanceof Error ? errorBody : new Error(errorBody), apiCallContext);

      if (options.headers.Authorization && mappedStatusCode === 401) {
        this.logger.warn('Attempting to refresh token in mid request because of a 401 or equivalent error', { requestId, error, options });
        await this.refreshToken();
      }

      return { errorBody, mappedStatusCode };
    };
    const onCriticalError = async (errorResponse: any, errorBody: any) => {
      const options = await getOptions();
      this.logger.error(`(MBE) API Error (${options.method} ${path})`, {
        fullPath,
        options,
        errorResponse,
        errorBody,
        duration: Date.now() - startedAt,
        requestId
      });
    };
    const onRetry = async (attemptNumber: number) => {
      const options = await getOptions();
      this.logger.warn(`Retrying request ${options.method} ${path}`, {
        attemptNumber,
        requestId,
        method: options.method,
        path,
        duration: Date.now() - startedAt
      });
    };

    return retryRequest({ path: fullPath, attemptsLeft, getOptions, onSuccess, onImmediateError, onCriticalError, onRetry, http: this.httpService.fetch });
  };

  /**
   * refreshes token set. Groups concurrent refresh attempts into one
   */
  private refreshToken = (() => {
    const refresh = async () => {
      this._isOngoingRefresh = true;
      const tokenSet = await this.getTokenSetAsync();
      const refreshTokenValue = tokenSet?.refreshToken;
      const deviceId = await this.appService.getDeviceIdAsync();

      this.logger.assert(LogMethod.WARN, !deviceId, `deviceId is falsy (${deviceId})`);
      this.logger.assert(LogMethod.WARN, !refreshTokenValue, `refreshTokenValue is falsy (${refreshTokenValue})`, { tokenSet });
      this.logger.info('Refreshing token');
      this.logger.debug('Refreshing token', { tokenSet, refreshTokenValue });

      try {
        const credentials = await this.authService.auth.refreshToken({ refreshToken: refreshTokenValue, scope: ENV.AUTH0.SCOPE });
        const newTokenSet: ITokenSet = {
          ...credentials,
          refreshToken: credentials.refreshToken,
          accessTokenExpiryTime: new Date(Date.now() + credentials.expiresIn * 1000).toString()
        };
        await this.setTokenSet(newTokenSet, deviceId);

        if (!newTokenSet?.accessToken || !newTokenSet?.accessTokenExpiryTime || !newTokenSet?.refreshToken || !deviceId) {
          throw { json: async () => ({ newTokenSet }), status: 503 };
        }
        await this.setTokenSet(newTokenSet, deviceId);
        this.logger.info('Token refreshed');
        this.logger.debug('Token refreshed', { newTokenSet });
      } catch (error) {
        const parsedError = typeof error?.json === 'function' ? await error.json() : error;
        this.logger.error(error, { context: 'Error refreshing token (setting token as invalid)', error, parsedError });
        this._isTokenInvalid = true;
        throw error;
      } finally {
        this._isOngoingRefresh = undefined;
      }
    };
    return () => {
      if (!this._isOngoingRefresh) return refresh();
    };
  })();

  private shouldRefreshToken = async (): Promise<boolean> => {
    const tokenSet = await this.getTokenSetAsync();
    const accessTokenExpiryTime = tokenSet?.accessTokenExpiryTime;
    if (!accessTokenExpiryTime) return false;
    return Date.parse(accessTokenExpiryTime) - ENV.API.API_TOKEN_EXPIRATION_PADDING_MS <= Date.now();
  };

  updateCardStatus = async (body: IGiftCardStatus): Promise<void> => {
    return await this.request(this.urls.SET_GIFT_CARD_STATUS, body, HTTP_METHOD.POST);
  };
}

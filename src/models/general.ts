import { Dispatch } from 'react';
import Auth0 from 'react-native-auth0';

import { ApiService } from '_services/ApiService';
import { AppService } from '_services/AppService';
import { CCPAService } from '_services/CCPAService';
import { ICrashlyticsService } from '_services/CrashlyticsService';
import { EventTrackerService } from '_services/EventTrackerService';
import { IHttpService } from '_services/HttpService';
import { NativeHelperService } from '_services/NativeHelperService';
import { Logger } from '_services/Logger';
import { IPerformanceTrackingService } from '_services/PerformanceTrackingService';
import { RaiseService } from '_services/RaiseService';
import { RemoteConfigService } from '_services/RemoteConfigService';
import { ICardLinkState } from '_state_mgmt/cardLink/state';
import { ICoreState } from '_state_mgmt/core/state';
import { IGameState } from '_state_mgmt/game/state';
import { IGiftCardState } from '_state_mgmt/giftCard/state';
import { IMessagesState } from '_state_mgmt/messages/state';
import { IMissionState } from '_state_mgmt/mission/state';
import { IRewardState } from '_state_mgmt/reward/state';
import { ISurveyState } from '_state_mgmt/survey/state';
import { IUserState } from '_state_mgmt/user/state';

export interface IAction<T = string, P = any> {
  type: T;
  payload: P;
}

export type IReducer<S = any, A = any> = (state: S, action: IAction<A>) => S;

export interface Deps {
  apiService: ApiService;
  appService: AppService;
  crashlyticsService: ICrashlyticsService;
  httpService: IHttpService;
  performanceTrackingService: IPerformanceTrackingService;
  raiseService: RaiseService;
  nativeHelperService: NativeHelperService;
  stateSnapshot: { get: () => IGlobalState; set: (state: IGlobalState) => void };
  logger: Logger;
  eventTrackerService: EventTrackerService;
  ccpaService: CCPAService;
  remoteConfigService: RemoteConfigService;
  authService: Auth0;
}
export type IGlobalState = {
  core: ICoreState;
  user: IUserState;
  game: IGameState;
  mission: IMissionState;
  reward: IRewardState;
  survey: ISurveyState;
  messages: IMessagesState;
  cardLink: ICardLinkState;
  giftCard: IGiftCardState;
};

export interface IGlobalContext {
  state: IGlobalState;
  dispatch: Dispatch<IAction<any, any>>;
  deps: Deps;
}

export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export interface ITokenSet {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiryTime: string;
  sywToken?: string;
  /**
   * @deprecated deviceId does not belong to ITokenSet anymore.
   */
  deviceId?: string;
  scope?: string;
  expiresIn?: number;
  tokenType?: string;
}

export enum FeatureFlag {
  API_OVERRIDE = 'API_OVERRIDE',
  TEST_ONLY = 'TEST_ONLY',
  ENV_BANNER = 'ENV_BANNER',
  BUTTON_DEBUG = 'BUTTON_DEBUG',
  LOG_LEVEL_INFO = 'LOG_LEVEL_INFO',
  LOG_LEVEL_DEBUG = 'LOG_LEVEL_DEBUG',
  LOG_LEVEL_WARN = 'LOG_LEVEL_WARN',
  LOG_LEVEL_ERROR = 'LOG_LEVEL_ERROR',
  LOG_VIEW = 'LOG_VIEW',
  STREAK_REDEEM_CARD = 'STREAK_REDEEM_CARD',
  SAILTHRU_TRACKING = 'SAILTHRU_TRACKING',
  SURVEY = 'SURVEY',
  PREDICTIVE_MAP_SEARCH = 'PREDICTIVE_MAP_SEARCH',
  MISSIONS_SEARCH = 'MISSIONS_SEARCH',
  SEE_ALL_TRANSACTIONS = 'SEE_ALL_TRANSACTIONS',
  WALLET_YOUR_GC = 'WALLET_YOUR_GC'
}

export type DateLike = Date | string | number;

export type HTMLString = string;

export interface IGameLevelUI {
  updatedAt: DateLike;
  level: number;
}

export interface ICCPASetting {
  allow: boolean;
}

export interface IOnboarding {
  seenOnboarding: boolean;
}

export enum ButtonCreativeType {
  HERO = 'hero',
  CAROUSEL = 'carousel',
  LIST = 'list',
  GRID = 'grid',
  DETAIL = 'detail',
  OTHER = 'other'
}

export interface ISearchHistoryItem {
  keyword: string;
  lastUpdatedAt: DateLike;
}

export enum TooltipKey {
  EARN = 'earn',
  REWARDS = 'rewards',
  MISSIONS = 'missions',
  STREAK = 'streak'
}

export interface IApiOverrideRule {
  key: string;
  description?: string;
  matcher: string; // reg exp
  status: number;
  response: any;
}

export namespace RemoteConfigModel {
  export interface IAppVersion {
    suggested: number;
    required: number;
  }

  export interface IEarnSection {
    name: string;
    order: number;
    visible: boolean;
    title: string;
    description: string;
    seeAllButton: boolean;
  }
}

export enum RUNTIME_ENV {
  LIVE = 'live',
  DEV_TEST = 'test'
}

export interface IMeasure {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IExpirePointsBannerDataSet {
  lastPointsDate: DateLike;
  lastAcceptedDate: DateLike;
}

export interface ISailthruMessage {
  createdAt: string;
  custom: {
    [k: string]: string;
  };
  htmlText: string;
  id: string;
  isRead: boolean;
  text: string;
  title: string;
  type: string;
  cardImageUrl?: string;
  share: boolean;
}

export interface ITutorialStatus {
  isBannerWatched: boolean;
  date: string;
}

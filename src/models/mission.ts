import { HTMLString, DateLike } from './general';
import { ProgramType } from './offer';

export interface IMission {
  uuid: string; // generated on the client (api service) by combining offerCode with offerId
  name: string;
  description: string;
  image?: string;
  termsAndConditions: HTMLString;
  brandName: string;
  brandLogo?: string;
  brandDescription: string;
  brandCategories: string[];
  brandRequestorId: string;
  offerId: string;
  offerCode: string;
  rank: number;
  validFrom: DateLike;
  validUntil: DateLike;
  pointsAwarded: IPointsAwarded;
  callToActionUrl: string;
  provider: Provider;
  pubRef: string;
  rewardOfferCode: string;
}

export enum Provider {
  BUTTON = 'button',
  SURVEY = 'AdBloom',
  CARDLINK = 'mastercard'
}

export enum RedemptionType {
  POINT_PER_DOLLAR = 'PointsPerDollar',
  FIXED_POINTS = 'FixedPoints',
  PERCENT_OFF = 'PercentOff'
}

export interface IPointsAwarded {
  rewardType: RedemptionType;
  rewardValue: number;
  conditions: IAwardCondition[];
  alternateRewardValue?: number;
  programType?: ProgramType;
  programSubType?: string;
}

export interface IAwardCondition {
  category?: string;
  rewardValue: number;
  rewardType: RedemptionType;
  rewardOfferCode?: string;
  programType?: ProgramType;
  programSubType?: string;
  alternateRewardValue?: number;
}

export enum KeywordType {
  CATEGORY = 'category',
  BRAND = 'brand'
}

export interface IKeyword {
  value: string;
  type: KeywordType;
}

export interface ICategory {
  name: string;
  imageUrl: string;
  lifestyleUrl: string;
  rank: number;
}

export enum MissionListType {
  DEFAULT = 'Default',
  KEEP_EARNING = 'KeepEarning',
  FEATURED = 'Featured',
  SPECIAL = 'Specials',
  JUST_FOR_YOU = 'JustForYou',
  TRENDING = 'Trending',
  DYNAMIC_LIST_2 = 'EarnList2',
  DYNAMIC_LIST_3 = 'EarnList3',
  DYNAMIC_LIST_4 = 'EarnList4',
  DYNAMIC_LIST_6 = 'EarnList6',
  EXCEPTIONAL = 'EarnList5'
}

export enum RecentSearchHistoryType {
  MISSION = 'mission',
  CATEGORY = 'category '
}
export interface IRecentSearchHistory {
  id: string;
  name: string;
  type: RecentSearchHistoryType;
  isAvailableStreakIndicator?: boolean;
}

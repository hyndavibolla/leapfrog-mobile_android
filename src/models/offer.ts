import { DateLike } from './general';

export enum PointsType {
  EARN = 'earn',
  REDEEM = 'redeem',
  SURPRISE_REDEEM = 'surpriseRedeem',
  POINTS_EXPIRY = 'pointsExpiry',
  POINTS_AVAILABLE = 'pointsAvailable'
}

export enum ProgramSubCategory {
  GAS = 'gas',
  GROCERY = 'grocery',
  RESTAURANT = 'restaurant',
  SEARS = 'sears',
  KMART = 'kmart',
  OTHER = 'other',
  SURVEY = 'survey',
  MISSION = 'mission'
}

export enum ProgramType {
  SPEED = 'speed',
  BIG = 'big',
  STREAK = 'SYWMAX-Streak',
  ONBOARDING = 'onboarding',
  SYWMAX = 'SYWMAX',
  CARDLINK = 'cardlink',
  CITI = 'CITI'
}

export enum TransactionFilter {
  ALL_TRANSACTIONS = 'all-transactions',
  LOCAL_OFFERS = 'local-offers',
  MISSIONS = 'missions',
  REWARDS = 'rewards',
  SYW_MASTERCARD = 'SYW-mastercard'
}

export interface IOffer {
  id: string;
  points: number;
  pointsType: PointsType;
  programSubCategory: ProgramSubCategory;
  programType: ProgramType;
  name?: string;
  pointStartDate: DateLike;
  pointEndDate: DateLike;
  dollarRedeemed: number;
  rewardOfferCode?: string;
  isStreak?: boolean;
}

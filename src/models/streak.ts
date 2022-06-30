import { DateLike } from './general';
import { RedemptionType } from './mission';

export enum StreakThresholdType {
  TRIP = 'Trip'
}

export interface IStreakCondition {
  title: string;
  imageUrl: string;
  thresholdValue: number;
  thresholdType: StreakThresholdType;
  currentQualifiedValue: number;
  minimumSpendPerTransaction: number;
  disclaimer: string;
}

export interface IStreak {
  offerId: string;
  offerCode: string;
  startDt: DateLike;
  endDt: DateLike;
  title: string;
  rewardValue: number;
  rewardType: RedemptionType /** @todo confirm field name and values */;
  description: string;
  conditions: IStreakCondition[];
  imageUrl: string;
  thresholdValue: number;
  thresholdType: StreakThresholdType;
  currentQualifiedValue: number;
  minimumSpendPerTransaction: number;
  disclaimer: string;
  rank: number;
  rewardOfferCode: string;
  type: OfferType;
}

export enum OfferType {
  SINGLE = 'SINGLE',
  BBG = 'BBG'
}

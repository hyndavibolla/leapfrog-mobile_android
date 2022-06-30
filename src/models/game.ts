import { DateLike } from './general';

export enum LevelState {
  RELEGATION = 'relegation',
  SAFE = 'safe',
  PROMOTION = 'promotion',
  BASICLEVEL = 'basicLevel',
  SPECIAL = 'special',
  OVERMAXPOINTS = 'overmaxpoints'
}

export enum RedemptionCapType {
  POINTS = 'Points',
  TRANSACTIONS = 'Transactions',
  NO_CAP = ''
}

export enum RedemptionCapDuration {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  YEARLY = 'YEARLY',
  NEVER = 'NEVER'
}

export interface PointsToExpire {
  memberOwnPoints: number;
  memberOwnExpiryDate: DateLike;
}

export interface IGameBalance {
  availablePoints: number;
  pendingPoints: number;
  memberOwnPointsToExpire: PointsToExpire[];
}

export interface IGameMembership {
  userHasSywCard: boolean;
  userIsSywMaxMember: boolean;
  userIsAllowedToUseSywMax: boolean;
  sywCardLastFour: string;
}

export interface IGame {
  balance: IGameBalance;
  memberships: IGameMembership;
  missions: {
    pointsPerCent: number;
  };
  lastUpdatedAt: DateLike;
}

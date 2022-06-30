import { IOffer } from './offer';

import { DateLike } from './general';

export enum Status {
  AVAILABLE = 'available',
  PENDING_CONFIRMATION = 'pendingConfirmation',
  POINT_BURN = 'pointBurn'
}

export enum Type {
  TRANSACTION = 'transaction',
  ADJUSTMENT = 'adjustment',
  REDEMPTION = 'redemption',
  REDEEM = 'redeem',
  EXPIRY = 'pointsexpiry',
  AVAILABLE = 'pointsavailable',
  RETURN = 'return',
  OTHER = 'other'
}

export interface IActivity {
  points: number;
  activityType: Type;
  requestorName: string;
  offers: IOffer[];
  timestamp: DateLike;
  grossSpend?: number;
  brandDetails?: {
    brandName: string;
    brandShortDescription: string;
    brandLogo: string;
  };
  txnId: string;
  activityDetails?: {
    partnerId: string;
    giftCardName: string;
    giftCardValue?: number;
  };
}

export const getFallbackActivity = (): IActivity => ({
  points: 0,
  activityType: Type.TRANSACTION,
  requestorName: '...',
  offers: [],
  timestamp: undefined,
  grossSpend: undefined,
  txnId: ''
});

export const getStatusDisplayText = (activityType: string, offer: IOffer): string => {
  if (!offer.pointStartDate || new Date(offer.pointStartDate).getTime() <= Date.now()) return 'Available';
  if (new Date(offer.pointStartDate).getTime() > Date.now()) return 'Pending';
  return activityType;
};

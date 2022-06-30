import { DateLike } from './general';

export enum barcodeType {
  CODE128 = 'CODE128',
  PDF417 = 'PDF417',
  DATA_MATRIX = 'DATA_MATRIX',
  QR_CODE = 'QR_CODE',
  PDF417_COMPACT = 'PDF417_COMPACT'
}

export enum redemptionType {
  IN_STORE_ONLY = 'IN_STORE_ONLY',
  ONLINE_ONLY = 'ONLINE_ONLY',
  IN_STORE_OR_ONLINE_ONLY = 'IN_STORE_OR_ONLINE_ONLY',
  IN_RESTAURANT_ONLY = 'IN_RESTAURANT_ONLY',
  APP_ONLY = 'APP_ONLY'
}

export enum methodType {
  ENTER_ONLINE = 'ENTER_ONLINE',
  SHOW_BARCODE = 'SHOW_BARCODE',
  SHOW_DETAILS = 'SHOW_DETAILS',
  WRITE_ON_CHECK = 'WRITE_ON_CHECK'
}

export enum statusType {
  ACTIVE = 'A',
  HIDDEN = 'H'
}

export interface IMethod {
  kind: methodType;
}

export interface IGiftCard {
  cardBrand: string;
  cardNumber: string;
  cardValue: number;
  barcodeType: string;
  barcodeValue: string;
  pinNumber: string;
  cardProvider: string;
  providerCardId: string;
  providerBrandId: string;
  statusInd: statusType;
  purchaseTs: DateLike;
  cardBalance: number;
  cardBalanceCheckDt: DateLike;
  cardBalanceCheckAvailableCount: number;
  brandDetails: IGiftCardBrandDetail;
}
export interface IGiftCardBrandDetail {
  brandId: string;
  brandName: string;
  brandLogo: string;
  legalTerms: string;
  brandShortDescription: string;
  cardValueConfig: IGiftCardValueConfig;
  redemptionConfiguration: IGiftCardRedemptionConfiguration;
  categories: IGiftCardCategory[];
  faceplateUrl: null | string;
  backOfCardUrl: string;
}
export interface IGiftCardValueConfig {
  increment: number;
  maxValue: number;
  minValue: number;
  variableLoadSupported: boolean;
}
export interface IGiftCardCategory {
  name: string;
}
export interface IGiftCardRedemptionConfiguration {
  kind: string;
  methods: IGiftCardMethod[];
}
export interface IGiftCardMethod {
  kind: string;
}

export interface IGiftCardDetail {
  brandName: string;
  brandLogo: string;
  cardValue: number;
  cardBalance: number;
  cardNumber: string;
  cardPin: string;
  orderDate: DateLike;
  barcode: {
    kind: barcodeType;
    value: string;
  };
  brand_uuid: string;
  legal_terms: string;
  description: string;
  redemption_configs: {
    kind: redemptionType;
    methods: IMethod[];
  };
  balance_checks_available: number;
  balance_check_supported: boolean;
  balance_check_url: string;
}

export interface IGiftCardBalance {
  id: string;
  cardValue: number;
}

export interface IGiftCardStatus {
  id: string;
  status: statusType;
  cardProvider: string;
}

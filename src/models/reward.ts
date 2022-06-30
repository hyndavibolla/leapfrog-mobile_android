export enum SlideObjectType {
  BRAND = 'brands',
  CATEGORY = 'categories'
}

export interface IBrandDetail {
  brandId: string;
  brandName: string;
}

export interface ICategoryConfig {
  id: string;
  brands: IBrandDetail[];
}

export interface IRewardConfig {
  categories: ICategoryConfig[];
  limits: {
    minAmount: number;
    maxAmount: number;
    duration: string;
  };
}

export interface ICardValueConfig {
  increment: number;
  minValue: number;
  maxValue: number;
  variableLoadSupported: boolean;
  denominations?: number[];
}

export interface IRedemptionConfig {
  disclaimer: string;
  kind: string;
  methods: { info: string; kind: string }[];
}

export interface ICategory {
  name: string;
  availableBrands?: number;
}

export interface IBrand {
  id?: string; // added on the client
  brandName: string;
  iconUrl: string;
  legalTerms: string;
  description: string;
  cardValueConfig: ICardValueConfig;
  redemptionConfigs: IRedemptionConfig;
  sortedPosition: number;
  categories: ICategory[];
  backOfCardUrl?: string;
  faceplateUrl?: string;
}

export type ISlideObjectAttribute = IBrand | ICategory;

export interface ISlideObject {
  id: string; // might be an UUID or an enum of some kind
  type: SlideObjectType;
  attributes: ISlideObjectAttribute;
}

export const getFallbackBrand = (id: string): IBrand => ({
  id,
  brandName: '...',
  iconUrl: '',
  legalTerms: '...',
  description: '...',
  cardValueConfig: {
    increment: 1,
    minValue: 0,
    maxValue: 0,
    variableLoadSupported: false,
    denominations: []
  },
  redemptionConfigs: {
    disclaimer: '...',
    kind: '...',
    methods: []
  },
  sortedPosition: 0,
  categories: []
});

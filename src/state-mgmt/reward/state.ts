import { RewardModel } from '../../models';

/**
 * SlideObjectMapByType looks like:
 * {
 *  categories: {},
 *  brands: {
 *    id_1: <brand with id_1>
 *  }
 * }
 */
export type SlideObjectMapByType = Record<RewardModel.SlideObjectType, Record<string, RewardModel.ISlideObjectAttribute>>;
export enum KnownSlideObjectSearchKey {
  FULL_BRAND_SEARCH_RESULTS = 'full-brand-search-results',
  GENERAL_BRAND_SEARCH_RESULTS = 'general-brand-search-results',
  GENERAL_CATEGORY_SEARCH_RESULTS = 'general-category-search-results'
}
export type SlideObjectSearchMap = Record<KnownSlideObjectSearchKey, string[]> & Record<string, string[]>;

export interface IRewardState {
  config: RewardModel.IRewardConfig;
  categoryMap: { [categoryId: string]: string[] };
  slideObjectMapByType: SlideObjectMapByType;
  slideObjectSearchMap: SlideObjectSearchMap;
  slideCategoryIdList: string[];
}

export const initialState: IRewardState = {
  config: { categories: [], limits: { minAmount: null, maxAmount: null, duration: '0' } },
  categoryMap: {},
  slideObjectMapByType: Object.values(RewardModel.SlideObjectType).reduce((total, curr) => ({ ...total, [curr]: {} }), {} as SlideObjectMapByType),
  slideObjectSearchMap: Object.values(KnownSlideObjectSearchKey).reduce((total, key) => ({ ...total, [key]: [] }), {} as SlideObjectSearchMap),
  slideCategoryIdList: []
};

import { RewardModel } from '../../models';
import { KnownSlideObjectSearchKey } from './state';

export enum ACTION_TYPE {
  SET_REWARD_CONFIG = '[reward] set reward config',
  SET_SLIDE_MAP = '[reward] set slide object map',
  SET_SLIDE_SEARCH_LIST = '[reward] set slide search list',
  SET_MULTIPLE_SLIDE_SEARCH_LIST = '[reward] multiple set slide search list',
  FLUSH_SLIDE_SEARCH_LIST = '[reward] flush slide search list' /** redundant with set, but this is meant to be declarative */,
  FLUSH_MULTIPLE_SLIDE_SEARCH_LIST = '[reward] multiple flush slide search list',
  REMOVE_SLIDE_SEARCH_LIST = '[reward] remove slide search list',
  SET_SLIDE_CATEGORY_ID_LIST = '[reward] set slide category id list'
}

export const actions = {
  setRewardConfig: (rewardConfig: RewardModel.IRewardConfig) => ({ type: ACTION_TYPE.SET_REWARD_CONFIG, payload: { rewardConfig } }),
  setSlideMap: (list: RewardModel.ISlideObject[]) => ({ type: ACTION_TYPE.SET_SLIDE_MAP, payload: { list } }),
  setSlideSearchList: (key: KnownSlideObjectSearchKey | string, slideObjectIdList: string[]) => ({
    type: ACTION_TYPE.SET_SLIDE_SEARCH_LIST,
    payload: { key, slideObjectIdList }
  }),
  setMultipleSlideSearchList: (list: { key: KnownSlideObjectSearchKey | string; slideObjectIdList: string[] }[]) => ({
    type: ACTION_TYPE.SET_MULTIPLE_SLIDE_SEARCH_LIST,
    payload: { list }
  }),
  flushSlideSearchList: (key: KnownSlideObjectSearchKey | string) => ({ type: ACTION_TYPE.FLUSH_SLIDE_SEARCH_LIST, payload: { key } }),
  flushMultipleSlideSearchList: (list: (KnownSlideObjectSearchKey | string)[]) => ({ type: ACTION_TYPE.FLUSH_MULTIPLE_SLIDE_SEARCH_LIST, payload: { list } }),
  removeSlideSearchList: (key: KnownSlideObjectSearchKey | string) => ({ type: ACTION_TYPE.REMOVE_SLIDE_SEARCH_LIST, payload: { key } }),
  setSlideCategoryIdList: (list: string[]) => ({ type: ACTION_TYPE.SET_SLIDE_CATEGORY_ID_LIST, payload: { list } })
};

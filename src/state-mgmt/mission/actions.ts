import { MissionModel } from '_models';

export enum ACTION_TYPE {
  SET_MISSION_MAP = '[mission] set mission map',
  SET_SEARCH_LIST = '[mission] set search list',
  FLUSH_SEARCH_LIST = '[mission] flush search list' /** redundant with set, but this is meant to be declarative */,
  REMOVE_SEARCH_LIST = '[mission] remove search list',
  SET_CATEGORY_LIST = '[mission] set category list',
  SET_BUTTON_USER_ID = '[mission] set button user id',
  SET_KEYWORD_LIST = '[mission] set keyword list',
  SET_IS_BUTTON_INIT = '[mission] set is button init',
  SET_RECENT_VIEWED_MISSIONS = '[mission] set recently viewed missions'
}

export const actions = {
  setMissionMap: (missionList: MissionModel.IMission[]) => ({ type: ACTION_TYPE.SET_MISSION_MAP, payload: { missionList } }),
  setSearchList: (key: string, missionIdList: string[], title?: string) => ({
    type: ACTION_TYPE.SET_SEARCH_LIST,
    payload: { key, missionIdList, title }
  }),
  flushSearchList: (key: string) => ({ type: ACTION_TYPE.FLUSH_SEARCH_LIST, payload: { key } }),
  removeSearchList: (key: string) => ({ type: ACTION_TYPE.REMOVE_SEARCH_LIST, payload: { key } }),
  setCategoryList: (categoryList: MissionModel.ICategory[]) => ({ type: ACTION_TYPE.SET_CATEGORY_LIST, payload: { categoryList } }),
  setButtonUserId: (buttonUserId: string) => ({ type: ACTION_TYPE.SET_BUTTON_USER_ID, payload: { buttonUserId } }),
  setKeywordMap: (keywordMap: Partial<Record<MissionModel.KeywordType, string[]>>) => ({ type: ACTION_TYPE.SET_KEYWORD_LIST, payload: { keywordMap } }),
  setIsButtonInit: (isButtonInit: boolean) => ({ type: ACTION_TYPE.SET_IS_BUTTON_INIT, payload: { isButtonInit } }),
  setRecentlyViewedMissions: (missionList: MissionModel.IMission[]) => ({ type: ACTION_TYPE.SET_RECENT_VIEWED_MISSIONS, payload: { missionList } })
};

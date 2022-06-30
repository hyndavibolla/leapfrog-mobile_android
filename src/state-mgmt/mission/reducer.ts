import { IAction } from '_models/general';
import { listToMap } from '_utils/listToMap';
import { removeKeyList } from '_utils/removeKeyList';

import { ACTION_TYPE } from './actions';
import { IMissionState, initialState } from './state';

export const reducer = (state: IMissionState = initialState, { type, payload }: IAction): IMissionState => {
  switch (type) {
    case ACTION_TYPE.SET_MISSION_MAP:
      return { ...state, missionMap: listToMap(payload.missionList, state.missionMap, 'uuid') };
    case ACTION_TYPE.SET_SEARCH_LIST:
      return {
        ...state,
        missionSearchMap: {
          ...state.missionSearchMap,
          [payload.key]: Array.from(new Set([...payload.missionIdList, ...(state.missionSearchMap[payload.key] || [])]))
        },
        missionListTitleMap: { ...state.missionListTitleMap, [payload.key]: payload.title }
      };
    case ACTION_TYPE.FLUSH_SEARCH_LIST:
      return { ...state, missionSearchMap: { ...state.missionSearchMap, [payload.key]: [] } };
    case ACTION_TYPE.REMOVE_SEARCH_LIST:
      return { ...state, missionSearchMap: removeKeyList(state.missionSearchMap, [payload.key]) };
    case ACTION_TYPE.SET_CATEGORY_LIST:
      return { ...state, categoryList: payload.categoryList };
    case ACTION_TYPE.SET_KEYWORD_LIST:
      return { ...state, keywordMap: { ...state.keywordMap, ...payload.keywordMap } };
    case ACTION_TYPE.SET_BUTTON_USER_ID:
      return { ...state, buttonUserId: payload.buttonUserId || state.buttonUserId };
    case ACTION_TYPE.SET_IS_BUTTON_INIT:
      return { ...state, isButtonInit: payload.isButtonInit };
    case ACTION_TYPE.SET_RECENT_VIEWED_MISSIONS:
      return { ...state, recentlyViewedMissions: payload.missionList.slice(0, 10) };
    default:
      return state;
  }
};

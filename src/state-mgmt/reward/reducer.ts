import { IAction } from '../../models/general';
import { ACTION_TYPE } from './actions';
import { IRewardState, initialState, SlideObjectMapByType, SlideObjectSearchMap } from './state';
import { RewardModel } from '../../models';
import { removeKeyList } from '../../utils/removeKeyList';

export const reducer = (state: IRewardState = initialState, { type, payload }: IAction): IRewardState => {
  switch (type) {
    case ACTION_TYPE.SET_REWARD_CONFIG:
      return {
        ...state,
        config: payload.rewardConfig,
        categoryMap: (payload.rewardConfig as RewardModel.IRewardConfig).categories.reduce((total, curr) => ({ ...total, [curr.id]: curr.brands }), {})
      };
    case ACTION_TYPE.SET_SLIDE_MAP:
      return {
        ...state,
        slideObjectMapByType: (payload.list as RewardModel.ISlideObject[]).reduce(
          (total: SlideObjectMapByType, slideObject) => ({
            ...total,
            [slideObject.type]: { ...(total[slideObject.type] || {}), [slideObject.id]: { id: slideObject.id, ...slideObject.attributes } }
          }),
          state.slideObjectMapByType
        )
      };
    case ACTION_TYPE.SET_SLIDE_SEARCH_LIST:
      return {
        ...state,
        slideObjectSearchMap: {
          ...state.slideObjectSearchMap,
          [payload.key]: Array.from(new Set([...payload.slideObjectIdList, ...(state.slideObjectSearchMap[payload.key] || [])]))
        }
      };
    case ACTION_TYPE.SET_MULTIPLE_SLIDE_SEARCH_LIST:
      return {
        ...state,
        slideObjectSearchMap: payload.list.reduce(
          (total: SlideObjectSearchMap, { key, slideObjectIdList }) => ({
            ...total,
            [key]: Array.from(new Set([...slideObjectIdList, ...(state.slideObjectSearchMap[key] || [])]))
          }),
          state.slideObjectSearchMap
        )
      };
    case ACTION_TYPE.FLUSH_SLIDE_SEARCH_LIST:
      return { ...state, slideObjectSearchMap: { ...state.slideObjectSearchMap, [payload.key]: [] } };
    case ACTION_TYPE.FLUSH_MULTIPLE_SLIDE_SEARCH_LIST:
      return {
        ...state,
        slideObjectSearchMap: Object.entries(state.slideObjectSearchMap).reduce(
          (total, [key, value]) => ({ ...total, [key]: payload.list.includes(key) ? [] : value }),
          {} as SlideObjectSearchMap
        )
      };
    case ACTION_TYPE.REMOVE_SLIDE_SEARCH_LIST:
      return { ...state, slideObjectSearchMap: removeKeyList(state.slideObjectSearchMap, [payload.key]) };
    case ACTION_TYPE.SET_SLIDE_CATEGORY_ID_LIST:
      return { ...state, slideCategoryIdList: payload.list };
    default:
      return state;
  }
};

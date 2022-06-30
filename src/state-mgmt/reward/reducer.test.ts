import { reducer } from './reducer';
import { initialState } from './state';
import { actions } from './actions';
import { getRewardConfig_2, getSlideBrand_1 } from '../../test-utils/entities';
import { RewardModel } from '../../models';
import { removeKeyList } from '../../utils/removeKeyList';

describe('mission reducer', () => {
  it('should return the previous state when no switch case matches', () => {
    expect(reducer(undefined, { type: null, payload: null })).toBe(initialState);
  });

  it('should return a new state ACTION_TYPE.SET_REWARD_CONFIG', () => {
    expect(reducer(initialState, actions.setRewardConfig(getRewardConfig_2()))).toEqual({
      ...initialState,
      config: getRewardConfig_2(),
      categoryMap: { [getRewardConfig_2().categories[0].id]: getRewardConfig_2().categories[0].brands }
    });
  });

  it('should return a new state ACTION_TYPE.SET_SLIDE_MAP', () => {
    expect(
      reducer(
        initialState,
        actions.setSlideMap([{ id: getSlideBrand_1().id, type: RewardModel.SlideObjectType.BRAND, attributes: removeKeyList(getSlideBrand_1(), ['id']) }])
      )
    ).toEqual({
      ...initialState,
      slideObjectMapByType: { ...initialState.slideObjectMapByType, [RewardModel.SlideObjectType.BRAND]: { [getSlideBrand_1().id]: getSlideBrand_1() } }
    });
    expect(
      reducer(
        initialState,
        actions.setSlideMap([{ id: getSlideBrand_1().id, type: 'unknown-key' as any, attributes: removeKeyList(getSlideBrand_1(), ['id']) }])
      )
    ).toEqual({
      ...initialState,
      slideObjectMapByType: { ...initialState.slideObjectMapByType, ['unknown-key']: { [getSlideBrand_1().id]: getSlideBrand_1() } }
    });
  });

  it('should return a new state ACTION_TYPE.SET_SLIDE_SEARCH_LIST', () => {
    expect(reducer(initialState, actions.setSlideSearchList('keyOne', [getSlideBrand_1().id]))).toEqual({
      ...initialState,
      slideObjectSearchMap: { ...initialState.slideObjectSearchMap, keyOne: [getSlideBrand_1().id] }
    });
  });

  it('should return a new state ACTION_TYPE.SET_MULTIPLE_SLIDE_SEARCH_LIST', () => {
    expect(reducer(initialState, actions.setMultipleSlideSearchList([{ key: 'keyOne', slideObjectIdList: [getSlideBrand_1().id] }]))).toEqual({
      ...initialState,
      slideObjectSearchMap: { ...initialState.slideObjectSearchMap, keyOne: [getSlideBrand_1().id] }
    });
  });

  it('should return a new state ACTION_TYPE.FLUSH_SLIDE_SEARCH_LIST', () => {
    expect(
      reducer(
        { ...initialState, slideObjectSearchMap: { ...initialState.slideObjectSearchMap, keyOne: [getSlideBrand_1().id] } },
        actions.flushSlideSearchList('keyOne')
      )
    ).toEqual({
      ...initialState,
      slideObjectSearchMap: { ...initialState.slideObjectSearchMap, keyOne: [] }
    });
  });

  it('should return a new state ACTION_TYPE.FLUSH_MULTIPLE_SLIDE_SEARCH_LIST', () => {
    expect(
      reducer(
        { ...initialState, slideObjectSearchMap: { ...initialState.slideObjectSearchMap, keyOne: [getSlideBrand_1().id], keyTwo: [getSlideBrand_1().id] } },
        actions.flushMultipleSlideSearchList(['keyOne', 'keyTwo'])
      )
    ).toEqual({
      ...initialState,
      slideObjectSearchMap: { ...initialState.slideObjectSearchMap, keyOne: [], keyTwo: [] }
    });
  });

  it('should return a new state ACTION_TYPE.REMOVE_SLIDE_SEARCH_LIST', () => {
    expect(
      reducer({ ...initialState, slideObjectSearchMap: { ...initialState.slideObjectSearchMap, keyOne: [] } }, actions.removeSlideSearchList('keyOne'))
    ).toEqual(initialState);
  });

  it('should return a new state ACTION_TYPE.SET_SLIDE_CATEGORY_ID_LIST', () => {
    expect(reducer({ ...initialState }, actions.setSlideCategoryIdList(['categoryOne']))).toEqual({ ...initialState, slideCategoryIdList: ['categoryOne'] });
  });
});

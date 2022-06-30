import { getMission_1, getMission_2, getMissionCategory_1, getMissionCategory_2 } from '_test_utils/entities';
import { MissionModel } from '_models';

import { reducer } from './reducer';
import { initialState } from './state';
import { actions } from './actions';

describe('mission reducer', () => {
  it('should return the previous state when no switch case matches', () => {
    expect(reducer(undefined, { type: null, payload: null })).toBe(initialState);
  });

  it('should return a new state ACTION_TYPE.SET_MISSION_MAP', () => {
    expect(reducer(initialState, actions.setMissionMap([getMission_1(), getMission_2()]))).toEqual({
      ...initialState,
      missionMap: { [getMission_1().uuid]: getMission_1(), [getMission_2().uuid]: getMission_2() }
    });
  });

  it('should return a new state ACTION_TYPE.SET_SEARCH_LIST', () => {
    expect(reducer(initialState, actions.setSearchList('keyOne', [getMission_1().uuid], 'title'))).toEqual({
      ...initialState,
      missionSearchMap: { ...initialState.missionSearchMap, keyOne: [getMission_1().uuid] },
      missionListTitleMap: { ...initialState.missionListTitleMap, keyOne: 'title' }
    });
  });

  it('should return a new state ACTION_TYPE.FLUSH_SEARCH_LIST', () => {
    expect(
      reducer({ ...initialState, missionSearchMap: { ...initialState.missionSearchMap, keyOne: [getMission_1().uuid] } }, actions.flushSearchList('keyOne'))
    ).toEqual({
      ...initialState,
      missionSearchMap: { ...initialState.missionSearchMap, keyOne: [] }
    });
  });

  it('should return a new state ACTION_TYPE.REMOVE_SEARCH_LIST', () => {
    expect(reducer({ ...initialState, missionSearchMap: { ...initialState.missionSearchMap, keyOne: [] } }, actions.removeSearchList('keyOne'))).toEqual(
      initialState
    );
  });

  it('should return a new state ACTION_TYPE.SET_CATEGORY_LIST', () => {
    expect(reducer(initialState, actions.setCategoryList([getMissionCategory_1(), getMissionCategory_2()]))).toEqual({
      ...initialState,
      categoryList: [getMissionCategory_1(), getMissionCategory_2()]
    });
  });

  it('should return a new state ACTION_TYPE.SET_KEYWORD_LIST', () => {
    expect(reducer(initialState, actions.setKeywordMap({ [MissionModel.KeywordType.BRAND]: ['brand'] }))).toEqual({
      ...initialState,
      keywordMap: { [MissionModel.KeywordType.BRAND]: ['brand'], [MissionModel.KeywordType.CATEGORY]: [] }
    });
  });

  it('should return a new state ACTION_TYPE.SET_BUTTON_USER_ID', () => {
    expect(reducer(initialState, actions.setButtonUserId('id'))).toEqual({ ...initialState, buttonUserId: 'id' });
    expect(reducer({ ...initialState, buttonUserId: 'id2' }, actions.setButtonUserId(null))).toEqual({ ...initialState, buttonUserId: 'id2' });
  });

  it('should return a new state ACTION_TYPE.SET_IS_BUTTON_INIT', () => {
    expect(reducer(initialState, actions.setIsButtonInit(true))).toEqual({ ...initialState, isButtonInit: true });
  });

  it('should return a new state ACTION_TYPE.SET_RECENT_VIEWED_MISSIONS', () => {
    expect(reducer(initialState, actions.setRecentlyViewedMissions([getMission_1()]))).toEqual({ ...initialState, recentlyViewedMissions: [getMission_1()] });
  });
});

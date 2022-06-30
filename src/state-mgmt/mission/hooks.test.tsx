import { act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';

import { getMockDeps } from '_test_utils/getMockDeps';
import { Deps, IGlobalState } from '_models/general';
import { getMissionCategory_1, getMission_1, getMission_2 } from '_test_utils/entities';
import { getErrorToastExpectation } from '_test_utils/getErrorToastExpectation';
import { renderWrappedHook } from '_test_utils/renderWrappedHook';
import { ENV } from '_constants';
import { MissionModel } from '_models';
import { MissionListType } from '_models/mission';

import { getInitialState } from '../GlobalState';
import {
  useGetMissionCategoryList,
  useMissionFreeSearch,
  useGetSeeAllMissionGroup,
  useGetKnownMissionGroup,
  useGetMissionKeywordList,
  useSearchHistory,
  useGetMissionByBrandRequestorId,
  useUpdateRecentlyViewedMissions
} from './hooks';
import { actions } from './actions';
import { KnownMissionSearchKey } from './state';

describe('mission hooks', () => {
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
  });

  describe('useGetMissionCategoryList', () => {
    it('should fetch and set the mission category list', async () => {
      deps.apiService.fetchMissionCategoryList = jest.fn().mockResolvedValue([getMissionCategory_1()]);
      const { result, mockReducer } = renderWrappedHook(() => useGetMissionCategoryList(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.apiService.fetchMissionCategoryList).toBeCalled();
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setCategoryList([getMissionCategory_1()]));
      });
    });

    it('should NOT fetch category list if list is already present', async () => {
      const { result, mockReducer } = renderWrappedHook(() => useGetMissionCategoryList(), deps, {
        ...initialState,
        mission: { ...initialState.mission, categoryList: [getMissionCategory_1()] }
      });
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.apiService.fetchMissionCategoryList).not.toBeCalled();
        expect(mockReducer).not.toBeCalled();
      });
    });
  });

  describe('useGetMissionKeywordList', () => {
    it('should fetch and return a mission keyword list', async () => {
      const { result, mockReducer } = renderWrappedHook(() => useGetMissionKeywordList(), deps);
      await act(async () => {
        await (result.current[0] as any)();
        expect(deps.apiService.fetchMissionKeywordList).toBeCalled();
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setKeywordMap(expect.any(Object)));
      });
    });
  });

  describe('useMissionFreeSearch', () => {
    let key;
    let listType;
    let brandName;
    let limit;
    let offset;
    let keyword;
    let rewardOfferCode;

    beforeEach(() => {
      key = 'custom-key';
      listType = MissionListType.DEFAULT;
      brandName = 'walmart';
      limit = 2;
      offset = 0;
      keyword = 'hello';
      rewardOfferCode = 'code-1';
      deps.stateSnapshot.get = () => initialState;
    });

    it('should fetch and set a free mission search', async () => {
      deps.apiService.fetchMissionList = jest.fn().mockResolvedValue({ userId: 'buttonUserId', missions: [getMission_1(), getMission_2()], title: 'title' });
      const { result, mockReducer } = renderWrappedHook(() => useMissionFreeSearch(), deps);
      await act(async () => {
        await (result.current[0] as any)(key, listType, undefined, brandName, limit, offset, keyword, rewardOfferCode);
        expect(deps.apiService.fetchMissionList).toBeCalledWith({
          brandName,
          keyword,
          limit,
          listType,
          offset,
          rewardOfferCode
        });
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setMissionMap([getMission_1(), getMission_2()]));
        expect(mockReducer).lastCalledWith(expect.any(Object), actions.setSearchList(key, [getMission_1().uuid, getMission_2().uuid], expect.any(String)));
      });
    });

    it('should fetch a free mission search that matches a known category', async () => {
      deps.stateSnapshot.get = () => ({
        ...initialState,
        mission: { ...initialState.mission, keywordMap: { ...initialState.mission.keywordMap, [MissionModel.KeywordType.CATEGORY]: ['category'] } }
      });
      deps.apiService.fetchMissionList = jest.fn().mockResolvedValue({ missions: [] });
      const { result } = renderWrappedHook(() => useMissionFreeSearch(), deps);
      await act(async () => {
        await (result.current[0] as any)(key, listType, undefined, brandName, limit, offset, 'category');
        expect(deps.apiService.fetchMissionList).toBeCalledWith({
          listType,
          category: 'category',
          brandName,
          limit,
          offset
        });
      });
    });

    it('should fetch a free mission search that matches a known category when a specific category is selected', async () => {
      deps.stateSnapshot.get = () => ({
        ...initialState,
        mission: { ...initialState.mission, keywordMap: { ...initialState.mission.keywordMap, [MissionModel.KeywordType.CATEGORY]: ['category'] } }
      });
      deps.apiService.fetchMissionList = jest.fn().mockResolvedValue({ missions: [] });
      const { result } = renderWrappedHook(() => useMissionFreeSearch(), deps);
      await act(async () => {
        await (result.current[0] as any)(key, listType, 'category', brandName, limit, offset, 'some search');
        expect(deps.apiService.fetchMissionList).toBeCalledWith({
          listType,
          category: 'category',
          brandName,
          limit,
          offset,
          keyword: 'some search'
        });
      });
    });

    it('should fetch a free mission search that matches a known brand', async () => {
      deps.stateSnapshot.get = () => ({
        ...initialState,
        mission: { ...initialState.mission, keywordMap: { ...initialState.mission.keywordMap, [MissionModel.KeywordType.BRAND]: ['brand'] } }
      });
      deps.apiService.fetchMissionList = jest.fn().mockResolvedValue({ missions: [] });
      const { result } = renderWrappedHook(() => useMissionFreeSearch(), deps);
      await act(async () => {
        await (result.current[0] as any)(key, listType, undefined, undefined, limit, offset, 'brand');
        expect(deps.apiService.fetchMissionList).toBeCalledWith({
          brandName: 'brand',
          limit,
          listType,
          offset
        });
      });
    });

    it('should toast an error when fetch fails', async () => {
      deps.apiService.fetchMissionList = () => Promise.reject('nop');
      await getErrorToastExpectation(() => useMissionFreeSearch(), deps, [key, listType, undefined, brandName, limit, offset]);
    });
  });

  describe('useGetSeeAllMissionGroup', () => {
    it('should fetch and set "see all" mission group', async () => {
      deps.apiService.fetchMissionList = jest.fn().mockResolvedValue({ userId: 'buttonUserId', missions: [getMission_1(), getMission_2()], title: 'title' });
      const { result, mockReducer } = renderWrappedHook(() => useGetSeeAllMissionGroup(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.apiService.fetchMissionList).toBeCalledWith({
          listType: MissionListType.DEFAULT,
          limit: ENV.MISSION_LIMIT.FULL,
          offset: expect.any(Number)
        });
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setMissionMap([getMission_1(), getMission_2()]));
        expect(mockReducer).lastCalledWith(
          expect.any(Object),
          actions.setSearchList(KnownMissionSearchKey.SEE_ALL, [getMission_1().uuid, getMission_2().uuid], expect.any(String))
        );
      });
    });
  });

  describe('useGetKnownMissionGroup', () => {
    it('should fetch and set known mission group', async () => {
      const missionList = Array.from(new Array(60)).map((_, index) => ({ ...getMission_1(), offerId: String(index) }));
      deps.apiService.fetchMissionList = jest.fn(async ({ listType }) => ({ userId: 'buttonUserId', missions: missionList, title: 'title', listType })) as any;
      const { result, mockReducer } = renderWrappedHook(() => useGetKnownMissionGroup(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.apiService.fetchMissionList).toBeCalledWith({ listType: MissionListType.DYNAMIC_LIST_2, limit: expect.any(Number) });
        expect(deps.apiService.fetchMissionList).toBeCalledWith({ listType: MissionListType.DYNAMIC_LIST_3, limit: expect.any(Number) });
        expect(deps.apiService.fetchMissionList).toBeCalledWith({ listType: MissionListType.DYNAMIC_LIST_4, limit: expect.any(Number) });
        expect(deps.apiService.fetchMissionList).toBeCalledWith({ listType: MissionListType.DYNAMIC_LIST_6, limit: expect.any(Number) });
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setMissionMap(expect.any(Array)));
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.flushSearchList(MissionListType.DYNAMIC_LIST_2));
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.flushSearchList(MissionListType.DYNAMIC_LIST_3));
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.flushSearchList(MissionListType.DYNAMIC_LIST_4));
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.flushSearchList(MissionListType.DYNAMIC_LIST_6));
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setSearchList(MissionListType.DYNAMIC_LIST_2, expect.any(Array), expect.any(String)));
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setSearchList(MissionListType.DYNAMIC_LIST_3, expect.any(Array), expect.any(String)));
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setSearchList(MissionListType.DYNAMIC_LIST_4, expect.any(Array), expect.any(String)));
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setSearchList(MissionListType.DYNAMIC_LIST_6, expect.any(Array), expect.any(String)));
      });
    });
  });

  describe('useSearchHistory', () => {
    it('should get search history', async () => {
      deps.nativeHelperService.storage.get = async () =>
        Array.from(Array(ENV.MISSION_SEARCH_HISTORY_LENGTH)).map((_, i) => ({ keyword: String(i), lastUpdatedAt: i })) as any;
      const { result } = renderWrappedHook(() => useSearchHistory(), deps);
      await act(async () => {
        await (result.current.getSearchHistoryAsyncCb[0] as () => Promise<any>)();
        expect(result.current.getSearchHistoryAsyncCb[3]).toHaveLength(ENV.MISSION_SEARCH_HISTORY_LENGTH);
      });
    });

    it('should get search history with a fallback', async () => {
      deps.nativeHelperService.storage.get = async () => null;
      const { result } = renderWrappedHook(() => useSearchHistory(), deps);
      await act(async () => {
        await (result.current.getSearchHistoryAsyncCb[0] as () => Promise<any>)();
        expect(result.current.getSearchHistoryAsyncCb[3]).toHaveLength(0);
      });
    });

    it('should set search history', async () => {
      const keyword = 'keyword';
      const repeatedSearch = { keyword, lastUpdatedAt: 1980 };
      const response = Array.from(Array(ENV.MISSION_SEARCH_HISTORY_LENGTH * 2)).map((_, i) => ({ keyword: String(i), lastUpdatedAt: i }));

      deps.nativeHelperService.storage.get = async () => [...response, repeatedSearch] as any;
      const { result } = renderWrappedHook(() => useSearchHistory(), deps);
      await act(async () => {
        await (result.current.setSearchHistory as (a: string) => Promise<any>)(keyword);
        expect(deps.nativeHelperService.storage.set).toBeCalledWith(
          ENV.STORAGE_KEY.MISSION_SEARCH_HISTORY,
          expect.arrayContaining([{ keyword, lastUpdatedAt: expect.anything() }])
        );
      });
    });
  });

  describe('useGetMissionByBrandRequestorId', () => {
    it('should get a mission by brand requestor id', async () => {
      deps.apiService.fetchMissionList = jest.fn().mockResolvedValue({ missions: [getMission_1()] });
      const { result, mockReducer } = renderWrappedHook(() => useGetMissionByBrandRequestorId(), deps);
      await act(async () => {
        await (result.current[0] as any)(getMission_1().brandRequestorId);
        expect(deps.apiService.fetchMissionList).toBeCalledWith({
          listType: MissionListType.DEFAULT,
          limit: 1,
          offset: 0,
          brandRequestorId: getMission_1().brandRequestorId
        });
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setMissionMap([getMission_1()]));
      });
    });

    it('should get a mission by brand requestor id and not set it on the map when nothing is found', async () => {
      deps.apiService.fetchMissionList = jest.fn().mockResolvedValue({ missions: [] });
      const { result, mockReducer } = renderWrappedHook(() => useGetMissionByBrandRequestorId(), deps);
      await act(async () => {
        await (result.current[0] as any)(getMission_1().brandRequestorId);
        expect(mockReducer).not.toBeCalled();
      });
    });
  });

  describe('useUpdateRecentlyViewedMissions', () => {
    it('should update recently viewed missions based on currently existent/active missions', async () => {
      const brandRequestorId: string[] = [getMission_2().brandRequestorId, getMission_1().brandRequestorId];
      deps.apiService.fetchMissionList = jest.fn().mockResolvedValueOnce({ missions: [getMission_1(), getMission_2()] });

      const { result, mockReducer } = renderWrappedHook(() => useUpdateRecentlyViewedMissions(), deps);
      await waitFor(async () => {
        await result.current[0](brandRequestorId);
        expect(deps.apiService.fetchMissionList).toBeCalledWith({
          listType: MissionListType.DEFAULT,
          limit: 20,
          offset: 0,
          brandRequestorId: brandRequestorId
        });
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setRecentlyViewedMissions([getMission_2(), getMission_1()]));
      });
    });

    it('should not update recently viewed missions if there are no ids to compare against', async () => {
      const { result, mockReducer } = renderWrappedHook(() => useUpdateRecentlyViewedMissions(), deps);
      await waitFor(async () => {
        await (result.current[0] as any)([]);
        expect(deps.apiService.fetchMissionList).not.toBeCalled();
        expect(mockReducer).not.toBeCalled();
      });
    });
  });
});

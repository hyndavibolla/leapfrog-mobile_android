import { useCallback, useContext } from 'react';

import { MissionModel } from '_models';
import { ISearchHistoryItem } from '_models/general';
import { MissionListType } from '_models/mission';
import { ENV, ForterActionType, PageNames, ROUTES, TealiumEventType, UxObject } from '_constants';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useErrorLog, useErrorToast, useEventTracker } from '_state_mgmt/core/hooks';
import { sortByDate } from '_utils/sortByDate';
import { useAsyncCallback } from '_utils/useAsyncCallback';
import { getPageNameWithParams } from '_utils/trackingUtils';

import { actions } from './actions';
import { KnownMissionSearchKey } from './state';

export const useGetMissionCategoryList = () => {
  const { dispatch, deps, state } = useContext(GlobalContext);
  const categoryState = useAsyncCallback(async () => {
    if (state.mission.categoryList.length) return;
    deps.logger.info('Getting offer categories');
    const categoryList = await deps.apiService.fetchMissionCategoryList();
    dispatch(actions.setCategoryList(categoryList));
  }, [deps.apiService.fetchMissionCategoryList]);
  useErrorLog(categoryState[2], 'There was an issue fetching mission categories');
  return categoryState;
};

export const useGetMissionKeywordList = () => {
  const { deps, dispatch } = useContext(GlobalContext);
  const keywordState: [() => Promise<void>, boolean, any, void] = useAsyncCallback(async () => {
    deps.logger.info('Getting offer keywords');
    const keywordMap = await deps.apiService.fetchMissionKeywordList();
    dispatch(actions.setKeywordMap(keywordMap));
  }, [deps.apiService.fetchMissionKeywordList]);
  useErrorLog(keywordState[2], 'There was an issue fetching keywords');
  return keywordState;
};

export const useGetMissionByBrandRequestorId = () => {
  const { deps, dispatch } = useContext(GlobalContext);
  const fetchState: [(brandRequestorId: string) => Promise<void>, boolean, any, void] = useAsyncCallback(async (brandRequestorId: string) => {
    deps.logger.info('Getting offer by brandRequestorId', { brandRequestorId });
    const { missions } = await deps.apiService.fetchMissionList({
      listType: MissionListType.DEFAULT,
      limit: 1,
      offset: 0,
      brandRequestorId
    });
    const [mission] = missions;
    if (mission) {
      dispatch(actions.setMissionMap([mission]));
    }
  }, []);
  useErrorLog(fetchState[2], 'There was an issue fetching mission');
  return fetchState;
};

export const useUpdateRecentlyViewedMissions = () => {
  const { deps, dispatch } = useContext(GlobalContext);
  const fetchState: [(brandRequestorId: string[]) => Promise<void>, boolean, any, void] = useAsyncCallback(async (brandRequestorId: string[]) => {
    if (!brandRequestorId.length) return;
    deps.logger.info('Getting mission list by brandRequestorId', { brandRequestorId });
    const { missions } = await deps.apiService.fetchMissionList({
      listType: MissionListType.DEFAULT,
      limit: 20,
      offset: 0,
      brandRequestorId
    });
    missions.sort((a, b) => brandRequestorId.indexOf(a.brandRequestorId) - brandRequestorId.indexOf(b.brandRequestorId)); //sort missions list by brandRequestorId list
    dispatch(actions.setRecentlyViewedMissions(missions));
  }, []);
  useErrorLog(fetchState[2], 'There was an issue fetching mission');
  return fetchState;
};

export const useMissionFreeSearch = (shouldShowToast?: boolean) => {
  const { dispatch, deps } = useContext(GlobalContext);
  const { trackUserEvent } = useEventTracker();
  const searchState: [
    (
      key: string,
      listType: MissionListType,
      category?: string,
      brandName?: string,
      limit?: number,
      offset?: number,
      keyword?: string,
      rewardOfferCode?: string,
      programSubType?: string
    ) => Promise<MissionModel.IMission[]>,
    boolean,
    any,
    MissionModel.IMission[]
  ] = useAsyncCallback(
    async (
      key: string,
      listType: MissionListType,
      category?: string,
      brandName?: string,
      limit?: number,
      offset?: number,
      keyword?: string,
      rewardOfferCode?: string,
      programType?: string
    ) => {
      const { keywordMap } = deps.stateSnapshot.get().mission;

      /** START modifying args to comply with the expected backend query */
      const cleanString = (s: string) => (s || '').trim().toLowerCase();
      const brandList = keywordMap[MissionModel.KeywordType.BRAND];
      const categoryList = keywordMap[MissionModel.KeywordType.CATEGORY];
      const cleanKeyword = cleanString(keyword);
      const cleanCategory = cleanString(category);
      const cleanBrandName = cleanString(brandName);
      const safeBrandName = !brandName && cleanKeyword ? brandList.find(i => cleanString(i) === cleanKeyword) : brandName;
      const safeCategory = !category && cleanKeyword ? categoryList.find(i => cleanString(i) === cleanKeyword) : category;
      const safeKeyword = cleanCategory !== cleanString(safeCategory) || cleanBrandName !== cleanString(safeBrandName) ? undefined : cleanKeyword;
      /** END modifying args to comply with the expected backend query */

      deps.logger.info('Searching offers');
      deps.logger.debug('useMissionFreeSearch', {
        key,
        listType,
        category: safeCategory,
        brandName: safeBrandName,
        limit,
        offset,
        keyword: safeKeyword,
        rewardOfferCode,
        programType
      });
      const { missions: missionList, title } = await deps.apiService.fetchMissionList({
        listType,
        category: safeCategory,
        brandName: safeBrandName,
        limit,
        offset,
        keyword: safeKeyword,
        rewardOfferCode,
        programType
      });
      const queryCategory = category ? `&category=${category}` : '';
      trackUserEvent(
        TealiumEventType.SEARCH,
        {
          page_name: getPageNameWithParams(PageNames.EARN.MISSION_SEE_ALL, [listType]),
          event_type: ROUTES.MAIN_TAB.EARN,
          event_detail: keyword,
          uxObject: UxObject.SEARCH,
          search_term: keyword,
          search_results_num: missionList.length.toString(),
          address: `${ENV.SCHEME}${ROUTES.MISSION_SEE_ALL}?search_term=${keyword}${queryCategory}`
        },
        ForterActionType.SEARCH_QUERY
      );
      dispatch(actions.setMissionMap(missionList));
      dispatch(
        actions.setSearchList(
          key,
          /** merging with previous? list in case of pagination. If this intends to be a fresh search, a flush action should be dispatched by consumer */
          Array.from(new Set([...(deps.stateSnapshot.get().mission.missionSearchMap[key] || []), ...missionList.map(mission => mission.uuid)])),
          title
        )
      );
      return missionList;
    },
    []
  );

  useErrorToast(!shouldShowToast && searchState[2], null, 'Whoops! Something went wrong');

  return searchState;
};

export const useGetKnownMissionGroup = () => {
  const { dispatch, deps } = useContext(GlobalContext);
  const knownMissionGroupState = useAsyncCallback(async () => {
    deps.logger.info('Getting known dynamic offer lists');
    const missionResultLists = await Promise.all(
      [MissionListType.DYNAMIC_LIST_2, MissionListType.DYNAMIC_LIST_3, MissionListType.DYNAMIC_LIST_4, MissionListType.DYNAMIC_LIST_6].map(key =>
        deps.apiService.fetchMissionList({ listType: key, limit: ENV.MISSION_LIMIT.KEEP_EARNING + 1 })
      )
    );

    /** placing entire result set in the mission repository */
    dispatch(actions.setMissionMap(missionResultLists.reduce((total, curr) => [...total, ...curr.missions], [])));
    /** resetting search lists so there is no duplication on missions that changed uuid */
    [MissionListType.DYNAMIC_LIST_2, MissionListType.DYNAMIC_LIST_3, MissionListType.DYNAMIC_LIST_4, MissionListType.DYNAMIC_LIST_6].forEach(key =>
      dispatch(actions.flushSearchList(key))
    );
    /** setting new search lists */
    missionResultLists.forEach(({ listType, title, missions, userId }) => {
      dispatch(
        actions.setSearchList(
          listType,
          missions.map(({ uuid }) => uuid),
          title
        )
      );
      dispatch(actions.setButtonUserId(userId));
    });
  }, []);
  useErrorLog(knownMissionGroupState[2], 'There was an issue fetching missions');
  return knownMissionGroupState;
};

export const useGetSeeAllMissionGroup = () => {
  const offset = 0;
  const { dispatch, deps } = useContext(GlobalContext);
  const seeAllMissionGroupState = useAsyncCallback(async () => {
    deps.logger.info('Getting all offers');
    const { missions, title } = await deps.apiService.fetchMissionList({ listType: MissionListType.DEFAULT, limit: ENV.MISSION_LIMIT.FULL, offset });
    dispatch(actions.setMissionMap(missions));
    dispatch(
      actions.setSearchList(
        KnownMissionSearchKey.SEE_ALL,
        missions.map(({ uuid }) => uuid),
        title
      )
    );
  }, []);
  useErrorLog(seeAllMissionGroupState[2], 'There was an issue fetching missions');
  return seeAllMissionGroupState;
};

export const useSearchHistory = () => {
  const { deps } = useContext(GlobalContext);
  const getSearchHistoryAsyncCb = useAsyncCallback(async () => {
    deps.logger.debug('useSearchHistory', 'getSearchHistory');
    const historyList = await deps.nativeHelperService.storage.get<ISearchHistoryItem[]>(ENV.STORAGE_KEY.MISSION_SEARCH_HISTORY);
    return (historyList || []).sort(sortByDate('lastUpdatedAt')).reverse();
  }, [deps.nativeHelperService.storage]);

  const [onGetSearchHistory] = getSearchHistoryAsyncCb;
  const setSearchHistory = useCallback(
    async (keyword: string) => {
      deps.logger.debug('useSearchHistory', 'setSearchHistory', keyword);
      const formattedKeyword = keyword.trim().toLowerCase();
      const historyList = await onGetSearchHistory();
      const newHistory: ISearchHistoryItem[] = [{ keyword: formattedKeyword, lastUpdatedAt: Date.now() }, ...historyList]
        .reduce((total, item) => (total.some(i => i.keyword === item.keyword) ? total : [...total, item]), [] as ISearchHistoryItem[])
        .slice(0, ENV.MISSION_SEARCH_HISTORY_LENGTH * 2 - 1 /** saving twice the limit to keep some extra items in case limit increases */);
      await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.MISSION_SEARCH_HISTORY, newHistory);
    },
    [deps.nativeHelperService.storage, onGetSearchHistory, deps.logger]
  );
  return { getSearchHistoryAsyncCb, setSearchHistory };
};

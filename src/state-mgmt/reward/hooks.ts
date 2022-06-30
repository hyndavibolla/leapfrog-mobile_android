import { useContext } from 'react';

import { GlobalContext } from '../GlobalState';
import { actions } from './actions';
import { useAsyncCallback } from '../../utils/useAsyncCallback';
import { useErrorLog } from '../core/hooks';
import { useSid } from '../../utils/useSid';

import { RewardModel } from '../../models';
import { ISlideFetchPayload } from '../../services/RaiseService';
import { KnownSlideObjectSearchKey } from './state';
import { ENV } from '../../constants';
import { getGiftCardOptionList } from '../../utils/getGiftCardOptionList';

export const useGetRewardConfig = (throwOnRejection?: boolean) => {
  const { deps } = useContext(GlobalContext);
  const rewardConfigState = useAsyncCallback(
    async () => {
      deps.logger.info('Getting reward configuration');
      const config = await deps.apiService.fetchRewardConfig();
      return config;
    },
    [],
    throwOnRejection
  );
  useErrorLog(rewardConfigState[2], 'There was an issue fetching reward configurations');
  return rewardConfigState;
};

export const useGetSlideCategoryIdList = (throwOnRejection?: boolean) => {
  const { dispatch, deps } = useContext(GlobalContext);
  const rewardConfigState = useAsyncCallback(
    async () => {
      deps.logger.info('Getting reward categories');
      const list = await deps.raiseService.fetchSlideCategoryIdList();
      dispatch(actions.setSlideCategoryIdList(list));
    },
    [],
    throwOnRejection
  );
  useErrorLog(rewardConfigState[2], 'There was an issue fetching slide category id list');
  return rewardConfigState;
};

export const useRewardFreeSearch = (throwOnRejection?: boolean) => {
  const { dispatch, deps } = useContext(GlobalContext);

  const searchState: [
    (key: string, entity: RewardModel.SlideObjectType, payload: ISlideFetchPayload, blackList: string[]) => Promise<void>,
    boolean,
    any,
    void
  ] = useAsyncCallback(
    async (key: string, entity: RewardModel.SlideObjectType, payload: ISlideFetchPayload, blackList: string[]) => {
      deps.logger.info('Searching reward cards');
      deps.logger.debug('useRewardFreeSearch', { key, entity, payload });
      const slideObjectList = await deps.raiseService.fetchSlideBrand(entity, payload);
      const safeSlideObjectList = slideObjectList.filter(o => !blackList.includes(o.id) && getGiftCardOptionList(o.attributes as RewardModel.IBrand).length);
      dispatch(actions.setSlideMap(safeSlideObjectList));
      dispatch(
        actions.setSlideSearchList(
          key,
          /** merging with previous? list in case of pagination. If this intends to be a fresh search, a flush action should be dispatched by consumer */
          Array.from(new Set([...(deps.stateSnapshot.get().reward.slideObjectSearchMap[key] || []), ...safeSlideObjectList.map(o => o.id)]))
        )
      );
    },
    [],
    throwOnRejection
  );
  useErrorLog(searchState[2], 'There was an issue fetching rewards');
  return searchState;
};

export const useRewardConfigBrandSearch = () => {
  const { dispatch, deps } = useContext(GlobalContext);
  const [onRewardFreeSearch] = useRewardFreeSearch(true);
  const [onSlideCategoryIdList] = useGetSlideCategoryIdList(true);
  const [onRewardConfigLoad] = useGetRewardConfig(true);
  const rewardConfigBrandSearchState = useAsyncCallback(async () => {
    deps.logger.info('Getting reward brands');
    /** getting ward config */
    const config = await onRewardConfigLoad();
    const blacklistedBrandList =
      config.categories.find(c => c.id === ENV.BLACKLIST_BRAND_CATEGORY_KEY)?.brands.map(b => b.brandId) /* istanbul ignore next */ || [];
    /** getting config and all brands */
    await Promise.all([
      onSlideCategoryIdList(),
      onRewardFreeSearch(KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS, RewardModel.SlideObjectType.BRAND, {}, blacklistedBrandList)
    ]);
    const { slideObjectMapByType } = deps.stateSnapshot.get().reward;
    const slideBrandMap = slideObjectMapByType[RewardModel.SlideObjectType.BRAND] as Record<string, RewardModel.IBrand>;
    const configCategoryList = config.categories
      /** removing categories that really don't exist on raise */
      /** removing brands that really don't belong to those categories */
      .sort((firstCategory, nextCategory) => {
        if (firstCategory.id < nextCategory.id) return -1;
        if (firstCategory.id > nextCategory.id) return 1;
        return 0;
      })
      .reduce(
        (total, curr) => [
          ...total,
          {
            ...curr,
            brands: [ENV.CUSTOM_BRAND_CATEGORY_KEY, ENV.BLACKLIST_BRAND_CATEGORY_KEY].includes(curr.id)
              ? curr.brands
              : curr.brands.filter(({ brandId }) => slideBrandMap[brandId]?.categories.map(({ name }) => name).includes(curr.id))
          } as RewardModel.ICategoryConfig
        ],
        [] as RewardModel.ICategoryConfig[]
      )
      /** removing categories with empty brand lists */
      .filter(c => !!c.brands.length);

    /** re-setting config excluding invalid categories (the ones that are not in raise or are empty after removing invalid brands) */
    /** this might cause some flickering on the UI while loading, but these measures are only to mitigate data bugs and they should change nothing if data is correct on prod */
    const curatedConfig: RewardModel.IRewardConfig = { ...config, categories: configCategoryList };
    dispatch(actions.setRewardConfig(curatedConfig));

    /** client side grouping brand ids by config categories */
    const { categoryMapIdList } = Object.values<RewardModel.IBrand>(slideBrandMap).reduce(
      (total, curr) => ({
        ...total,
        categoryMapIdList: curr.categories.reduce(
          (t, category) => ({
            ...t,
            [category.name]: total.categoryMapIdList[category.name] && [...total.categoryMapIdList[category.name], curr.id]
          }),
          total.categoryMapIdList
        )
      }),
      {
        categoryMapIdList: configCategoryList.reduce((t, c) => ({ ...t, [c.id]: [] as string[] }), {} as Record<string, string[]>)
      }
    );
    /** flushing reward config brand id lists */
    dispatch(actions.flushMultipleSlideSearchList(configCategoryList.map(c => c.id)));
    /** setting brand id lists by config category */
    dispatch(
      actions.setMultipleSlideSearchList(
        Object.entries(categoryMapIdList)
          .filter(([_, list]) => !!(list as string[])?.length)
          .map(([key, slideObjectIdList]) => ({ key, slideObjectIdList: slideObjectIdList as string[] }))
      )
    );
  }, [onRewardFreeSearch]);
  useErrorLog(rewardConfigBrandSearchState[2], 'There was an issue fetching brands');
  return rewardConfigBrandSearchState;
};

export const useCheckoutUrl = (brandId: string, cardValue: number, brandName: string, brandLogo: string, points: number) => {
  const { CHECKOUT_BASE_URL, CHECKOUT_PATH } = ENV.API.SLIDE;
  const { deps } = useContext(GlobalContext);
  const [getStoredSid] = useSid();

  return useAsyncCallback(async () => {
    const refId = await deps.apiService.fetchRefId();
    const storedSid = await getStoredSid();
    const trackingParameters = storedSid ? `sid=${storedSid}&intcmp=iMAXxRewards` : 'intcmp=iMAXxRewards';

    // Note: TBE confirmed that the refId should NOT be encoded and passed as-is.
    const e = encodeURIComponent;
    let queryParams = `${trackingParameters}&refid=${refId}&merchant=${e(ENV.MERCHANT)}&itemId=${e(brandId)}&itemName=${e(brandName)}&price=${e(
      cardValue
    )}&unit=cent&qty=1&imageUrl=${e(brandLogo)}&ffmType=${e('Digital Delivery')}&points=${points}`;
    // trailing slash is required by Raise, but does not need to be included in the hash calculation
    const url = `${CHECKOUT_BASE_URL}/${CHECKOUT_PATH}/?${queryParams}`;

    deps.logger.info('Opening rewards check out');
    deps.logger.debug('useCheckoutUrl', { url });
    return url;
  }, []);
};

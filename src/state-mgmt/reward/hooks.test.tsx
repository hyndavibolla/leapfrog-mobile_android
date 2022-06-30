import { act } from '@testing-library/react-hooks';

import { getMockDeps } from '../../test-utils/getMockDeps';
import { useGetRewardConfig, useRewardFreeSearch, useRewardConfigBrandSearch, useCheckoutUrl, useGetSlideCategoryIdList } from './hooks';
import { Deps, FeatureFlag, IGlobalState } from '../../models/general';
import { actions } from './actions';
import { getRewardConfig_1, getRewardConfig_2, getSlideCategoryIdList, getSlideObject_1, getSlideObject_2 } from '../../test-utils/entities';
import { renderWrappedHook } from '../../test-utils/renderWrappedHook';
import { RewardModel } from '../../models';
import { KnownSlideObjectSearchKey } from './state';
import { getStateSnapshotStorage } from '../../utils/getStateSnapshotStorage';
import { ENV } from '../../constants';
import { getInitialState } from '../GlobalState';

describe('reward hooks', () => {
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
  });

  describe('useGetRewardConfig', () => {
    it('should fetch the reward config', async () => {
      deps.apiService.fetchRewardConfig = jest.fn().mockResolvedValue(getRewardConfig_1()) as any;
      const { result } = renderWrappedHook(() => useGetRewardConfig(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.apiService.fetchRewardConfig).toBeCalled();
        expect(result.current[3]).toEqual(getRewardConfig_1());
      });
    });
  });

  describe('useGetSlideCategoryIdList', () => {
    it('should fetch the reward config', async () => {
      deps.apiService.fetchRewardConfig = jest.fn().mockResolvedValue(getSlideCategoryIdList()) as any;
      const { result, mockReducer } = renderWrappedHook(() => useGetSlideCategoryIdList(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.raiseService.fetchSlideCategoryIdList).toBeCalled();
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setSlideCategoryIdList(getSlideCategoryIdList()));
      });
    });
  });

  describe('useRewardFreeSearch', () => {
    let key;
    let entity;
    let payload;

    beforeEach(() => {
      key = 'custom-key';
      entity = RewardModel.SlideObjectType.BRAND;
      payload = {
        pageNumber: 1,
        sizeSize: 2,
        sortBy: 'NAME',
        sortDirection: 'ASC',
        character: 'a',
        query: 'b',
        autocomplete: true,
        category: 'c'
      };
      deps.stateSnapshot.get = () => initialState;
    });

    it('should fetch and set a free slide object search', async () => {
      deps.raiseService.fetchSlideBrand = jest.fn().mockResolvedValue([getSlideObject_1()]);
      const { result, mockReducer } = renderWrappedHook(() => useRewardFreeSearch(), deps);
      await act(async () => {
        await (result.current[0] as any)(key, entity, payload, []);
        expect(deps.raiseService.fetchSlideBrand).toBeCalledWith(entity, payload);
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setSlideMap([getSlideObject_1()]));
        expect(mockReducer).lastCalledWith(expect.any(Object), actions.setSlideSearchList(key, [getSlideObject_1().id]));
      });
    });

    it('should ignore blacklisted brands', async () => {
      deps.raiseService.fetchSlideBrand = jest.fn().mockResolvedValue([getSlideObject_1(), getSlideObject_2()]);
      const { result, mockReducer } = renderWrappedHook(() => useRewardFreeSearch(), deps);
      await act(async () => {
        await (result.current[0] as any)(key, entity, payload, [getSlideObject_1().id]);
        expect(deps.raiseService.fetchSlideBrand).toBeCalledWith(entity, payload);
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setSlideMap([getSlideObject_2()]));
        expect(mockReducer).lastCalledWith(expect.any(Object), actions.setSlideSearchList(key, [getSlideObject_2().id]));
      });
    });

    it('should ignore brands generating invalid number option lists', async () => {
      deps.raiseService.fetchSlideBrand = jest.fn().mockResolvedValue([
        {
          ...getSlideObject_1(),
          attributes: {
            ...getSlideObject_1().attributes,
            cardValueConfig: { ...(getSlideObject_1().attributes as RewardModel.IBrand).cardValueConfig, variableLoadSupported: false, denominations: [] }
          }
        },
        getSlideObject_2()
      ]);
      const { result, mockReducer } = renderWrappedHook(() => useRewardFreeSearch(), deps);
      await act(async () => {
        await (result.current[0] as any)(key, entity, payload, []);
        expect(deps.raiseService.fetchSlideBrand).toBeCalledWith(entity, payload);
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setSlideMap([getSlideObject_2()]));
        expect(mockReducer).lastCalledWith(expect.any(Object), actions.setSlideSearchList(key, [getSlideObject_2().id]));
      });
    });
  });

  describe('useRewardConfigBrandSearch', () => {
    it('should fetch and set the reward config grouped brand lists', async () => {
      const config: RewardModel.IRewardConfig = {
        ...getRewardConfig_2(),
        categories: [
          { id: getSlideCategoryIdList()[0], brands: [{ brandId: 'id_1', brandName: '' }] },
          { id: getSlideCategoryIdList()[0], brands: [{ brandId: 'id_2', brandName: '' }] },
          {
            id: getSlideCategoryIdList()[1],
            brands: [
              { brandId: 'id_1', brandName: '' },
              { brandId: 'id_2', brandName: '' }
            ]
          },
          { id: ENV.BLACKLIST_BRAND_CATEGORY_KEY, brands: [{ brandId: 'id_4', brandName: 'tst' }] }
        ]
      };
      const brandList: RewardModel.ISlideObject[] = [
        {
          ...getSlideObject_1(),
          id: 'id_1',
          attributes: {
            ...getSlideObject_1().attributes,
            id: 'id_1',
            categories: [{ name: getSlideCategoryIdList()[0] }, { name: getSlideCategoryIdList()[1] }],
            brandName: 'brand_1'
          }
        },
        {
          ...getSlideObject_1(),
          id: 'id_2',
          attributes: { ...getSlideObject_1().attributes, id: 'id_2', categories: [{ name: getSlideCategoryIdList()[1] }], brandName: 'brand_2' }
        },
        {
          ...getSlideObject_1(),
          id: 'id_3',
          attributes: { ...getSlideObject_1().attributes, id: 'id_3', categories: [{ name: 'unknown_category' }], brandName: 'unknown_brand' }
        },
        {
          ...getSlideObject_1(),
          id: 'id_4',
          attributes: { ...getSlideObject_1().attributes, id: 'id_4', categories: [{ name: 'unknown_category' }], brandName: 'unknown_brand' }
        }
      ];
      deps.apiService.fetchRewardConfig = jest.fn().mockResolvedValue(config) as any;
      deps.raiseService.fetchSlideBrand = jest.fn().mockResolvedValue(brandList);
      deps.raiseService.fetchSlideCategoryIdList = jest.fn().mockResolvedValue(getSlideCategoryIdList()) as any;
      deps.stateSnapshot = getStateSnapshotStorage();
      const { result, mockReducer } = renderWrappedHook(() => useRewardConfigBrandSearch(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(mockReducer).toBeCalledWith(
          expect.any(Object),
          actions.setSlideSearchList(KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS, ['id_1', 'id_2', 'id_3'])
        );
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.flushMultipleSlideSearchList(expect.any(Array)));
        expect(mockReducer).toBeCalledWith(
          expect.any(Object),
          actions.setMultipleSlideSearchList([
            { key: getSlideCategoryIdList()[0], slideObjectIdList: ['id_1'] },
            { key: getSlideCategoryIdList()[1], slideObjectIdList: ['id_1', 'id_2'] }
          ])
        );
      });
    });
  });

  describe('useCheckoutUrl', () => {
    let ignoredFeatureFlags: FeatureFlag[];

    beforeAll(() => {
      ignoredFeatureFlags = ENV.IGNORED_FEATURE_LIST;
    });

    beforeEach(() => {
      ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
    });

    afterAll(() => {
      ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
    });

    it('should return a checkout url', async () => {
      const refId = 'ref_id%1%2%3'; // backend refIds are already encoded
      deps.apiService.fetchRefId = jest.fn().mockResolvedValue(refId);
      const { result } = renderWrappedHook(() => useCheckoutUrl('aaa', 30, 'brand name', 'brand image', 30000), deps, initialState);
      const [getCheckoutUrl] = result.current;
      expect(result.current[3]).toEqual(undefined);
      await act(async () => {
        await getCheckoutUrl();
      });

      const checkoutUrl = result.current[3];
      expect(checkoutUrl).toEqual(expect.any(String));
      expect(deps.apiService.fetchRefId).toBeCalled();
      const { CHECKOUT_BASE_URL, CHECKOUT_PATH } = ENV.API.SLIDE;
      expect(checkoutUrl).toContain(`${CHECKOUT_BASE_URL}/${CHECKOUT_PATH}`);
      expect(checkoutUrl).not.toContain('roToken');
      expect(checkoutUrl).toContain(refId);
    });

    it('should include sid tracking parameter', async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ sid: 'sid', inactiveDate: null });
      const { result } = renderWrappedHook(() => useCheckoutUrl('aaa', 30, 'brand name', 'brand image', 300000), deps, initialState);
      const [getCheckoutUrl] = result.current;
      expect(result.current[3]).toEqual(undefined);
      await act(async () => {
        await getCheckoutUrl();
      });
      expect(result.current[3]).toContain('sid');
    });

    it('should NOT include sid tracking parameter', async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(null);
      const { result } = renderWrappedHook(() => useCheckoutUrl('aaa', 30, 'brand name', 'brand image', 300000), deps, initialState);
      const [getCheckoutUrl] = result.current;
      expect(result.current[3]).toEqual(undefined);
      await act(async () => {
        await getCheckoutUrl();
      });
      expect(result.current[3]).not.toContain('sid');
    });

    it('should NOT include sid tracking parameter for inactive time exceeded', async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ sid: 'sid', inactiveDate: '2021-07-20T12:00:00.000Z' });
      const { result } = renderWrappedHook(() => useCheckoutUrl('aaa', 30, 'brand name', 'brand image', 300000), deps, initialState);
      const [getCheckoutUrl] = result.current;
      expect(result.current[3]).toEqual(undefined);
      await act(async () => {
        await getCheckoutUrl();
      });
      expect(result.current[3]).not.toContain('sid');
    });
  });
});

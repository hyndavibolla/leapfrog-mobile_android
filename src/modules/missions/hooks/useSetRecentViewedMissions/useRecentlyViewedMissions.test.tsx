import { waitFor } from '@testing-library/react-native';

import { Deps, IGlobalState } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWrappedHook } from '_test_utils/renderWrappedHook';
import { ENV } from '_constants/env';
import { getInitialState } from '_state_mgmt/GlobalState';

import { useRecentlyViewedMissions } from './useRecentlyViewedMissions';

describe('useRecentlyViewedMissions', () => {
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    deps = getMockDeps();
    initialState = getInitialState();
  });

  it('should store the new recent viewed item', async () => {
    const item = 'test';
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(null);

    const { result } = renderWrappedHook(() => useRecentlyViewedMissions(ENV.STORAGE_KEY.RECENTLY_VIEWED_MISSIONS), deps, initialState);
    const { setRecentlyViewedItem } = result.current;
    setRecentlyViewedItem(item);
    await waitFor(() => {
      expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.RECENTLY_VIEWED_MISSIONS, [item]);
    });
  });

  it('should not store the recent viewed item when is currently in the list', async () => {
    const item = 'test';
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce([item]);

    const { result } = renderWrappedHook(() => useRecentlyViewedMissions(ENV.STORAGE_KEY.RECENTLY_VIEWED_MISSIONS), deps, initialState);
    const { setRecentlyViewedItem } = result.current;
    setRecentlyViewedItem(item);
    await waitFor(() => {
      expect(deps.nativeHelperService.storage.set).not.toBeCalled();
    });
  });
});

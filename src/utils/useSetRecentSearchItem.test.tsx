import { waitFor } from '@testing-library/react-native';

import { useSetRecentSearchItem } from './useSetRecentSearchItem';
import { IRecentSearchHistory, RecentSearchHistoryType } from '../models/searchHistory';
import { Deps } from '../models/general';
import { getMockDeps } from '../test-utils/getMockDeps';
import { renderWrappedHook } from '../test-utils/renderWrappedHook';
import { ENV } from '_constants/env';

describe('useOfferAvailable', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should store the new search item', async () => {
    const item: IRecentSearchHistory = { id: 'id', name: 'name', type: RecentSearchHistoryType.MISSION };
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(null);
    const { result } = renderWrappedHook(() => useSetRecentSearchItem(ENV.STORAGE_KEY.MISSION_SEARCH_HISTORY), deps);
    result.current(item);
    await waitFor(() => {
      expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.MISSION_SEARCH_HISTORY, [item]);
    });
  });

  it('should store the same search item', async () => {
    const item: IRecentSearchHistory = { id: 'id', name: 'name', type: RecentSearchHistoryType.MISSION };
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce([item]);
    const { result } = renderWrappedHook(() => useSetRecentSearchItem(ENV.STORAGE_KEY.MISSION_SEARCH_HISTORY), deps);
    result.current(item);
    await waitFor(() => {
      expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.MISSION_SEARCH_HISTORY, [item]);
    });
  });
});

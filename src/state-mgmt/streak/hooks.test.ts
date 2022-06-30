import { act } from '@testing-library/react-hooks';

import { getMockDeps } from '../../test-utils/getMockDeps';
import { Deps } from '../../models/general';
import { useGetStreakList } from './hooks';
import { renderWrappedHook } from '../../test-utils/renderWrappedHook';
import { getStreak_1 } from '../../test-utils/entities';

describe('mission hooks', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  describe('useGetStreakList', () => {
    it('should fetch and return a mission keyword list', async () => {
      const { result } = renderWrappedHook(() => useGetStreakList(), deps);
      await act(async () => {
        await (result.current[0] as any)(true);
        expect(deps.apiService.fetchStreakList).toBeCalledWith(true);
        expect(result.current[3]).toEqual([getStreak_1()]);
      });
    });
  });
});

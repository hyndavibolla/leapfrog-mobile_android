import { act } from '@testing-library/react-hooks';

import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';

import { renderWrappedHook } from '_test_utils/renderWrappedHook';
import { getMockDeps } from '_test_utils/getMockDeps';
import { getGiftCardBalance } from '_test_utils/entities';
import useGiftCardBalance from '_state_mgmt/giftCard/giftCardBalance/useGiftCardBalance';

describe('gift card hook', () => {
  let deps: Deps;
  let state: IGlobalState;
  const giftCardId = 'abc123';

  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
  });

  it('should fetch gift card balance', async () => {
    deps.apiService.fetchGiftCardBalance = jest.fn().mockResolvedValueOnce(getGiftCardBalance());
    const { result } = renderWrappedHook(() => useGiftCardBalance(), deps, state);
    await act(async () => {
      await (result.current[0] as (...args: any[]) => Promise<any>)(giftCardId);
      expect(deps.apiService.fetchGiftCardBalance).toBeCalledWith(giftCardId);
      expect(result.current[3]).toEqual(getGiftCardBalance());
    });
  });
});

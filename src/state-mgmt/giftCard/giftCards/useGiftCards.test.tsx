import { waitFor } from '@testing-library/react-native';

import useGiftCards from '.';

import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';

import { renderWrappedHook } from '_test_utils/renderWrappedHook';
import { getMockDeps } from '_test_utils/getMockDeps';
import { getGiftCard } from '_test_utils/entities';

describe('gift card hook', () => {
  let deps: Deps;
  let state: IGlobalState;

  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
  });

  it('should fetch gift cards', async () => {
    const giftCard = { ...getGiftCard(), cardBalanceCheckDt: '2022-03-02T15:52:28.000Z' };
    deps.apiService.fetchGiftCardList = jest.fn().mockResolvedValueOnce({ giftCards: [giftCard] });
    const { result } = renderWrappedHook(() => useGiftCards(), deps, state);
    await waitFor(async () => {
      await (result.current[0] as (...args: any[]) => Promise<any>)();
      expect(deps.apiService.fetchGiftCardList).toBeCalled();
      expect(result.current[3]).toEqual([giftCard]);
      expect(deps.logger.warn).toBeCalledWith('Raise gift card created with zero checks available.', {
        providerCardId: giftCard.providerCardId,
        brandId: giftCard.brandDetails.brandId
      });
    });
  });

  it('should not log if dates are not equal', async () => {
    const giftCard = { ...getGiftCard(), cardBalanceCheckDt: '2022-03-03T15:52:28.000Z' };
    deps.apiService.fetchGiftCardList = jest.fn().mockResolvedValueOnce({ giftCards: [giftCard] });
    const { result } = renderWrappedHook(() => useGiftCards(), deps, state);
    await waitFor(async () => {
      await (result.current[0] as (...args: any[]) => Promise<any>)();
      expect(deps.apiService.fetchGiftCardList).toBeCalled();
      expect(result.current[3]).toEqual([giftCard]);
      expect(deps.logger.warn).not.toBeCalled();
    });
  });
});

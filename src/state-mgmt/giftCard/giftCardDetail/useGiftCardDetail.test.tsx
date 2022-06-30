import { act } from '@testing-library/react-hooks';

import useGiftCardDetail from '.';

import { Deps, IGlobalState } from '../../../models/general';
import { getInitialState } from '../../GlobalState';

import { renderWrappedHook } from '../../../test-utils/renderWrappedHook';
import { getMockDeps } from '../../../test-utils/getMockDeps';
import { getGiftCardDetail } from '../../../test-utils/entities';

describe('gift card hook', () => {
  let deps: Deps;
  let state: IGlobalState;
  const giftCardId = 'abc123';

  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
  });

  it('should fetch gift cards', async () => {
    deps.apiService.fetchGiftCardDetail = jest.fn().mockResolvedValueOnce(getGiftCardDetail());
    const { result } = renderWrappedHook(() => useGiftCardDetail(), deps, state);
    await act(async () => {
      await (result.current[0] as (...args: any[]) => Promise<any>)(giftCardId);
      expect(deps.apiService.fetchGiftCardDetail).toBeCalledWith(giftCardId);
      expect(result.current[3]).toEqual(getGiftCardDetail());
    });
  });
});

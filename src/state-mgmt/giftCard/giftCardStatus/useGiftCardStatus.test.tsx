import { waitFor } from '@testing-library/react-native';

import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';

import { renderWrappedHook } from '_test_utils/renderWrappedHook';
import { getMockDeps } from '_test_utils/getMockDeps';
import { statusType } from '_models/giftCard';

import useGiftCardStatus from './index';

describe('gift card status hook', () => {
  let deps: Deps;
  let state: IGlobalState;
  let giftCard = {
    id: '299c6f54-0cfc-464b-8aa8-3964fef21866',
    status: statusType.ACTIVE,
    cardProvider: 'RAISE'
  };

  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
  });

  it('should update gift card status to archive', async () => {
    deps.apiService.updateCardStatus = jest.fn().mockResolvedValue(undefined);
    const { result } = renderWrappedHook(() => useGiftCardStatus(), deps, state);

    await waitFor(() => result.current[0](giftCard.id, giftCard.status, giftCard.cardProvider));
    expect(deps.apiService.updateCardStatus).toBeCalledWith(giftCard);
  });

  it('should update gift card status to unarchive', async () => {
    giftCard = {
      ...giftCard,
      status: statusType.HIDDEN
    };
    deps.apiService.updateCardStatus = jest.fn().mockResolvedValue(undefined);
    const { result } = renderWrappedHook(() => useGiftCardStatus(), deps, state);

    await waitFor(() => result.current[0](giftCard.id, giftCard.status, giftCard.cardProvider));
    expect(deps.apiService.updateCardStatus).toBeCalledWith(giftCard);
  });

  it('should reject the update gift card status', async () => {
    deps.apiService.updateCardStatus = jest.fn().mockRejectedValueOnce({
      value: null,
      resultCode: 0,
      error: 5000
    });
    const { result } = renderWrappedHook(() => useGiftCardStatus(), deps, state);

    await waitFor(() => result.current[0](giftCard.id, giftCard.status, giftCard.cardProvider));
    expect(deps.apiService.updateCardStatus).toBeCalledWith(giftCard);
    expect(result.current[2]).toBeTruthy();
  });
});

import { useContext } from 'react';

import { useErrorLog } from '_state_mgmt/core/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { getIsSameDate } from '_utils/getIsSameDate';
import { IGiftCard } from '_models/giftCard';
import { DateLike } from '_models/general';

import { actions } from '../actions';

import { useAsyncCallback } from '_utils/useAsyncCallback';

export default function useGiftCards() {
  const { deps, dispatch } = useContext(GlobalContext);

  const checkRaiseAvailableChecks = ({
    cardBalanceCheckAvailableCount,
    cardBalanceCheckDt,
    purchaseTs,
    providerCardId,
    brandId
  }: {
    cardBalanceCheckAvailableCount: number;
    cardBalanceCheckDt: DateLike;
    purchaseTs: DateLike;
    providerCardId: string;
    brandId: string;
  }) => {
    if (!cardBalanceCheckAvailableCount && getIsSameDate(cardBalanceCheckDt, purchaseTs)) {
      deps.logger.warn('Raise gift card created with zero checks available.', { providerCardId, brandId });
    }
  };

  const fetchState: [() => Promise<IGiftCard[]>, boolean, any, IGiftCard[]] = useAsyncCallback(async () => {
    deps.logger.info('Getting Gift Cards');

    const { giftCards } = await deps.apiService.fetchGiftCardList();

    giftCards.map(({ cardBalanceCheckAvailableCount, cardBalanceCheckDt, purchaseTs, providerCardId, brandDetails: { brandId } }) =>
      checkRaiseAvailableChecks({ cardBalanceCheckAvailableCount, cardBalanceCheckDt, purchaseTs, providerCardId, brandId })
    );

    dispatch(actions.setGiftCardList(giftCards));
    return giftCards;
  }, []);
  useErrorLog(fetchState[2], 'There was an issue fetching Gift Cards');
  return fetchState;
}

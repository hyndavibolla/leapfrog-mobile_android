import { useContext } from 'react';

import { useErrorLog } from '_state_mgmt/core/hooks';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { IGiftCardBalance } from '_models/giftCard';

import { useAsyncCallback } from '_utils/useAsyncCallback';

export default function useGiftCardBalance() {
  const { deps } = useContext(GlobalContext);

  const fetchState: [(id: string) => Promise<IGiftCardBalance>, boolean, any, IGiftCardBalance] = useAsyncCallback(async (id: string) => {
    deps.logger.info('Getting Gift Card Balance');
    return await deps.apiService.fetchGiftCardBalance(id);
  }, []);
  useErrorLog(fetchState[2], 'There was an issue fetching Gift Card Balance');
  return fetchState;
}

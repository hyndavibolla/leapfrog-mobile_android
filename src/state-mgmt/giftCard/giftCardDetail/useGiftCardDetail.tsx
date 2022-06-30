import { useContext } from 'react';

import { useErrorLog } from '_state_mgmt/core/hooks';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { IGiftCardDetail } from '_models/giftCard';

import { useAsyncCallback } from '_utils/useAsyncCallback';

export default function useGiftCardDetail() {
  const { deps } = useContext(GlobalContext);

  const fetchState: [(id: string) => Promise<IGiftCardDetail>, boolean, any, IGiftCardDetail] = useAsyncCallback(async (id: string) => {
    deps.logger.info('Getting Gift Card Detail');
    return await deps.apiService.fetchGiftCardDetail(id);
  }, []);
  useErrorLog(fetchState[2], 'There was an issue fetching Gift Card Detail');
  return fetchState;
}

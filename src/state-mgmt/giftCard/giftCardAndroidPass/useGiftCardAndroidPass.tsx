import { useContext } from 'react';

import { useErrorToast } from '_state_mgmt/core/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useAsyncCallback } from '_utils/useAsyncCallback';

export default function useGiftCardAndroidPass() {
  const { deps } = useContext(GlobalContext);

  const fetchAndroidPass: [(id: string) => Promise<string>, boolean, any, string] = useAsyncCallback(async (id: string) => {
    deps.logger.info('Getting Gift Card Android Pass');
    const result = await deps.apiService.fetchAndroidWalletPass(id);
    return result.saveUri;
  }, []);
  useErrorToast(fetchAndroidPass[2], "This gift card can't be added now.", null);
  return fetchAndroidPass;
}

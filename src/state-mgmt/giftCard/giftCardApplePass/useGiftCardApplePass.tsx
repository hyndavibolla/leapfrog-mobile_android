import { useContext } from 'react';

import { useErrorToast } from '../../core/hooks';

import { GlobalContext } from '../../GlobalState';

import { useAsyncCallback } from '../../../utils/useAsyncCallback';
import AppleWalletService from '_services/AppleWalletService';

export default function useGiftCardApplePass() {
  const { deps } = useContext(GlobalContext);

  const fetchApplePass: [(giftCardId: string) => Promise<boolean>, boolean, any, boolean] = useAsyncCallback(async (giftCardId: string) => {
    deps.logger.info('Getting Gift Card Apple Pass');
    const applePass = (await deps.apiService.fetchAppleWalletPass(giftCardId)) as string;
    if (!applePass) throw new Error('No apple pass returned from service');
    return await AppleWalletService.addPassWithId(giftCardId, applePass);
  }, []);
  if (fetchApplePass[2]) {
    const error = fetchApplePass[2];
    deps.logger.error('Could not add pass to Wallet', { context: 'Apple Wallet Framework could not add the gift card', error });
  }
  useErrorToast(fetchApplePass[2], 'Your Gift Card could not be added to the Apple Wallet', null);
  return fetchApplePass;
}

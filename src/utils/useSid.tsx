import { useContext } from 'react';
import { ENV } from '../constants';
import { IDeepLinkStoredSid } from '../services/AppsFlyerService';
import { GlobalContext } from '../state-mgmt/GlobalState';
import { getDateDurationAsMinutes } from './getDateDurationAsMinutes';
import { useAsyncCallback } from './useAsyncCallback';

export const useSid = () => {
  const { deps } = useContext(GlobalContext);
  const fetchStoredSid: [() => Promise<string>, boolean, any, string] = useAsyncCallback(async () => {
    const storedFetchStoredSid = await deps.nativeHelperService.storage.get<IDeepLinkStoredSid>(ENV.STORAGE_KEY.SID);
    if (storedFetchStoredSid?.inactiveDate) {
      const recordSidInactiveDuration = getDateDurationAsMinutes(storedFetchStoredSid.inactiveDate);
      if (recordSidInactiveDuration > ENV.INACTIVE_DURATION_LIMIT_TIME) {
        await deps.nativeHelperService.storage.remove(ENV.STORAGE_KEY.SID);
        return '';
      }
    }

    if (storedFetchStoredSid?.sid) return storedFetchStoredSid.sid;

    return '';
  }, []);

  return fetchStoredSid;
};

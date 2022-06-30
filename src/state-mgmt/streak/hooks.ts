import { useContext } from 'react';

import { useAsyncCallback } from '../../utils/useAsyncCallback';
import { useErrorLog } from '../core/hooks';
import { GlobalContext } from '../GlobalState';

export const useGetStreakList = () => {
  const { deps } = useContext(GlobalContext);
  const cbState = useAsyncCallback(async (force?: boolean) => {
    deps.logger.debug('Getting streak list', { force });

    return await deps.apiService.fetchStreakList(force);
  }, []);
  useErrorLog(cbState[2], 'There was an issue fetching streak list');
  return cbState;
};

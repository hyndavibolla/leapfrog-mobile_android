import { useContext } from 'react';

import { useListenToAppState } from '../state-mgmt/core/hooks';
import { GlobalContext } from '../state-mgmt/GlobalState';
import { usePrevious } from './usePrevious';

export const useForeground = (callback: () => void) => {
  const { deps } = useContext(GlobalContext);
  const appState = useListenToAppState();
  const prevAppState = usePrevious(appState);
  if (['inactive', 'background'].includes(prevAppState) && appState === 'active') {
    deps.logger.info('App came back to foreground');
    callback();
  }
};

import { useContext } from 'react';

import { useListenToAppState } from '../state-mgmt/core/hooks';
import { GlobalContext } from '../state-mgmt/GlobalState';
import { usePrevious } from './usePrevious';

export const useBackground = (callback: () => void) => {
  const { deps } = useContext(GlobalContext);
  const appState = useListenToAppState();
  const prevAppState = usePrevious(appState);
  if (['inactive', 'active'].includes(prevAppState) && appState === 'background') {
    deps.logger.info('App going to background');
    callback();
  }
};

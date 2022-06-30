import { useContext } from 'react';

import { useErrorLog } from '../state-mgmt/core/hooks';
import { GlobalContext } from '../state-mgmt/GlobalState';
import { useAsyncCallback } from './useAsyncCallback';
import { IGeocodeAddress } from '../models/cardLink';

export const useGeocodeAddress = () => {
  const { deps } = useContext(GlobalContext);
  const fetchState: [(address: string) => Promise<IGeocodeAddress[]>, boolean, any, IGeocodeAddress[]] = useAsyncCallback(async (address: string) => {
    deps.logger.debug('useGeocodeAddress');
    return await deps.apiService.geocodeAddress(address);
  }, []);
  useErrorLog(fetchState[2], 'There was an issue geocoding address');
  return fetchState;
};

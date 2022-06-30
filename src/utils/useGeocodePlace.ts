import { useContext } from 'react';

import { useErrorLog } from '../state-mgmt/core/hooks';
import { GlobalContext } from '../state-mgmt/GlobalState';
import { useAsyncCallback } from './useAsyncCallback';
import { IGeocodePlace, IGeocodePlaceDetails } from '../models/cardLink';

export const useGeocodePlace = () => {
  const { deps } = useContext(GlobalContext);
  const fetchState: [(input: string, sessiontoken: string, location: string) => Promise<IGeocodePlace>, boolean, any, IGeocodePlace] = useAsyncCallback(
    async (input: string, sessiontoken: string, location: string) => {
      deps.logger.debug('useGeocodePlace');
      return await deps.apiService.fetchPlaceAutocomplete(input, sessiontoken, location);
    },
    []
  );
  useErrorLog(fetchState[2], 'There was an issue getting geocode place');
  return fetchState;
};

export const useGeocodePlaceDetails = () => {
  const { deps } = useContext(GlobalContext);
  const fetchState: [(place_id: string, sessiontoken: string) => Promise<IGeocodePlaceDetails>, boolean, any, IGeocodePlaceDetails] = useAsyncCallback(
    async (place_id: string, sessiontoken: string) => {
      deps.logger.debug('useGeocodePlaceDetails');
      return await deps.apiService.fetchPlaceDetails(place_id, sessiontoken);
    },
    []
  );
  useErrorLog(fetchState[2], 'There was an issue getting geocode place details');
  return fetchState;
};

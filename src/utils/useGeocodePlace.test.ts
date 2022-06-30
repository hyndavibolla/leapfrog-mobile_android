import { act } from '@testing-library/react-hooks';
import { getMockDeps } from '../test-utils/getMockDeps';
import { Deps } from '../models/general';
import { getGeocodePlace, getGeocodePlaceDetails } from '../test-utils/entities';
import { useGeocodePlace, useGeocodePlaceDetails } from './useGeocodePlace';
import { renderWrappedHook } from '../test-utils/renderWrappedHook';

describe('card link hooks', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  describe('useGeocodePlace', () => {
    it('should get a list of geocode place autocomplete', async () => {
      deps.apiService.fetchPlaceAutocomplete = jest.fn().mockResolvedValue([getGeocodePlace()]);
      const { result } = renderWrappedHook(() => useGeocodePlace(), deps);
      await act(async () => {
        const res = await result.current[0]();
        expect(deps.apiService.fetchPlaceAutocomplete).toBeCalled();
        expect(res).toEqual([getGeocodePlace()]);
      });
    });
  });

  describe('useGeocodePlaceDetails', () => {
    it('should get a list of geocode place details', async () => {
      deps.apiService.fetchPlaceDetails = jest.fn().mockResolvedValue([getGeocodePlaceDetails()]);
      const { result } = renderWrappedHook(() => useGeocodePlaceDetails(), deps);
      await act(async () => {
        const res = await result.current[0]();
        expect(deps.apiService.fetchPlaceDetails).toBeCalled();
        expect(res).toEqual([getGeocodePlaceDetails()]);
      });
    });
  });
});

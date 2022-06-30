import { act } from '@testing-library/react-hooks';
import { getMockDeps } from '../test-utils/getMockDeps';
import { Deps } from '../models/general';
import { getGeocodeAddress } from '../test-utils/entities';
import { useGeocodeAddress } from './useGeocodeAddress';
import { renderWrappedHook } from '../test-utils/renderWrappedHook';

describe('card link hooks', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  describe('useGeocodeAddress', () => {
    it('should get a list of geocode address', async () => {
      deps.apiService.geocodeAddress = jest.fn().mockResolvedValue([getGeocodeAddress()]);
      const { result } = renderWrappedHook(() => useGeocodeAddress(), deps);
      await act(async () => {
        const res = await result.current[0]();
        expect(deps.apiService.geocodeAddress).toBeCalled();
        expect(res).toEqual([getGeocodeAddress()]);
      });
    });
  });
});

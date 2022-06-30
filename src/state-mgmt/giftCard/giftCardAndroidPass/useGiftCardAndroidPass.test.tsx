import { act } from '@testing-library/react-hooks';

import useGiftCardAndroidPass from '.';
import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWrappedHook } from '_test_utils/renderWrappedHook';

describe('useGiftCardAndroidPass', () => {
  let deps: Deps;
  let state: IGlobalState;

  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
  });

  it('should call the requests & return the google api url', async () => {
    const passId = 'id123';
    deps.apiService.fetchAndroidWalletPass = jest.fn().mockResolvedValueOnce({ saveUri: 'https://google-api-example' });
    const { result } = renderWrappedHook(() => useGiftCardAndroidPass(), deps, state);
    await act(async () => {
      await (result.current[0] as (...args: any[]) => Promise<string>)(passId);
      expect(deps.apiService.fetchAndroidWalletPass).toBeCalledWith(passId);
      expect(result.current[3]).toEqual('https://google-api-example');
    });
  });
});

import { act } from '@testing-library/react-hooks';

import useGiftCardApplePass from '.';

import { Deps, IGlobalState } from '../../../models/general';
import { getMockDeps } from '../../../test-utils/getMockDeps';
import { getInitialState } from '../../GlobalState';
import { renderWrappedHook } from '../../../test-utils/renderWrappedHook';
import AppleWalletService from '_services/AppleWalletService';

describe('useGiftCardApplePass', () => {
  let deps: Deps;
  let state: IGlobalState;

  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
  });

  it('should retrieve the Apple pass from BE', async () => {
    const expectedResponse = 'base64-encoded-data';
    const passId = 'id123';
    AppleWalletService.addPassWithId = jest.fn().mockResolvedValue(true);
    deps.apiService.fetchAppleWalletPass = jest.fn().mockResolvedValueOnce(expectedResponse);
    const { result } = renderWrappedHook(() => useGiftCardApplePass(), deps, state);
    await act(async () => {
      await (result.current[0] as (...args: any[]) => Promise<any>)(passId);
      expect(deps.apiService.fetchAppleWalletPass).toBeCalledWith(passId);
      expect(result.current[3]).toEqual(true);
    });
  });

  it('should reject the Apple pass from BE', async () => {
    const expectedResponse = null;
    const passId = 'id123';
    AppleWalletService.addPassWithId = jest.fn().mockResolvedValue(true);
    deps.apiService.fetchAppleWalletPass = jest.fn().mockResolvedValueOnce(expectedResponse);
    const { result } = renderWrappedHook(() => useGiftCardApplePass(), deps, state);
    await act(async () => {
      await (result.current[0] as (...args: any[]) => Promise<any>)(passId);
      expect(deps.apiService.fetchAppleWalletPass).toBeCalledWith(passId);
      expect(result.current[2]).toBeTruthy();
    });
  });
});

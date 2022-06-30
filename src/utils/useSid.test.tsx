import moment from 'moment';

import { act } from '@testing-library/react-native';
import { ENV } from '../constants';

import { Deps } from '../models/general';
import { getMockDeps } from '../test-utils/getMockDeps';
import { renderWrappedHook } from '../test-utils/renderWrappedHook';

import { useSid } from './useSid';

describe('useSid', () => {
  let deps: Deps;
  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should return the complete sid string', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ sid: 'sid', inactiveDate: null });
    const { result } = renderWrappedHook(() => useSid(), deps);
    await act(async () => {
      const res = await result.current[0]();
      expect(deps.nativeHelperService.storage.get).toBeCalledWith(ENV.STORAGE_KEY.SID);
      expect(res).toEqual('sid');
    });
  });

  it('should return sid with a empty string', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(null);
    const { result } = renderWrappedHook(() => useSid(), deps);
    await act(async () => {
      const res = await result.current[0]();
      expect(res).toEqual('');
    });
  });

  it('should return an empty string with date that exceeds the inactive limit', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ sid: 'sid', inactiveDate: '2021-07-20T12:00:00.000Z' });
    const { result } = renderWrappedHook(() => useSid(), deps);
    await act(async () => {
      const res = await result.current[0]();
      expect(deps.nativeHelperService.storage.remove).toBeCalledWith(ENV.STORAGE_KEY.SID);
      expect(res).toEqual('');
    });
  });

  it('should return the sid string value with date between the limit', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ sid: 'sid', inactiveDate: moment() });
    const { result } = renderWrappedHook(() => useSid(), deps);
    await act(async () => {
      const res = await result.current[0]();
      expect(res).toEqual('sid');
    });
  });
});

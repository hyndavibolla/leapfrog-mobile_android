import { act } from '@testing-library/react-native';

import { useSailthruMessages, useNewOnMaxMessages } from './hooks';
import { renderWrappedHook } from '../../test-utils/renderWrappedHook';
import { Deps } from '../../models/general';
import { getMockDeps } from '../../test-utils/getMockDeps';

describe('messages hooks', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  describe('useSailthruMessages', () => {
    it('should get messages', async () => {
      const { result } = renderWrappedHook(() => useSailthruMessages(), deps);
      await act(async () => {
        await result.current[1]();
        expect(deps.nativeHelperService.sailthru.getMessages).toBeCalled();
        expect(result.current[0].length).toBeGreaterThan(0);
      });
    });

    it('should make an error log when getMessages fails', async () => {
      deps.nativeHelperService.sailthru.getMessages = jest.fn().mockRejectedValueOnce('error');
      const { result } = renderWrappedHook(() => useSailthruMessages(), deps);
      await act(async () => {
        await result.current[1]();
        expect(deps.nativeHelperService.sailthru.getMessages).toBeCalled();
        expect(deps.logger.error).toBeCalled();
      });
    });

    it('should mark a message as read', async () => {
      const { result } = renderWrappedHook(() => useSailthruMessages(), deps);
      await act(async () => {
        await result.current[1]();
        expect(deps.nativeHelperService.sailthru.getMessages).toBeCalled();
        await result.current[2](result.current[0][0]);
        expect(result.current[0][0]).toMatchObject({ isRead: true });
      });
    });

    it('should make an error log when markMessageAsRead fails', async () => {
      deps.nativeHelperService.sailthru.markMessageAsRead = jest.fn().mockRejectedValueOnce('error');
      const { result } = renderWrappedHook(() => useSailthruMessages(), deps);
      await act(async () => {
        await result.current[1]();
        expect(deps.nativeHelperService.sailthru.getMessages).toBeCalled();
        await result.current[2]([]);
        expect(deps.logger.error).toBeCalled();
      });
    });
  });

  describe('useNewOnMaxMessages', () => {
    it('should get messages', async () => {
      const { result } = renderWrappedHook(() => useNewOnMaxMessages(), deps);
      await act(async () => {
        await result.current[1]();
        expect(deps.nativeHelperService.sailthru.getMessages).toBeCalled();
        expect(result.current[0].length).toBeGreaterThan(0);
      });
    });
    it('should mark a message as read', async () => {
      const { result } = renderWrappedHook(() => useNewOnMaxMessages(), deps);
      await act(async () => {
        await result.current[1]();
        expect(deps.nativeHelperService.sailthru.getMessages).toBeCalled();
        const lastAmount = result.current[0].length;
        await result.current[2](result.current[0][1]);
        expect(result.current[0]).toHaveLength(lastAmount - 1);
      });
    });

    it('should mark the onboard message as read', async () => {
      const { result } = renderWrappedHook(() => useNewOnMaxMessages(), deps);
      await act(async () => {
        await result.current[1]();
        expect(deps.nativeHelperService.sailthru.getMessages).toBeCalled();
        await result.current[4]();
        expect(result.current[3]).toBeFalsy();
      });
    });

    it('should not show the onboard when read recently', async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(Date.now());
      const { result } = renderWrappedHook(() => useNewOnMaxMessages(), deps);
      await act(async () => {
        await result.current[1]();
        expect(deps.nativeHelperService.sailthru.getMessages).toBeCalled();
        expect(result.current[3]).toBeFalsy();
      });
    });
  });
});

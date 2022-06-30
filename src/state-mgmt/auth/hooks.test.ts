import { act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';

import { getMockDeps } from '../../test-utils/getMockDeps';
import { useRestoreSession, useAuthentication, useLogout } from './hooks';
import { Deps, IGlobalState, ITokenSet } from '../../models/general';
import { renderWrappedHook } from '../../test-utils/renderWrappedHook';
import { ConversionEventType, ENV } from '../../constants';
import { getStateSnapshotStorage } from '../../utils/getStateSnapshotStorage';
import { wait } from '../../utils/wait';
import { createUUID } from '../../utils/create-uuid';
import { getInitialState } from '../GlobalState';

describe('auth hooks', () => {
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    deps.stateSnapshot = getStateSnapshotStorage();
  });

  describe('useRestoreSession', () => {
    it('should set tokens when they exist', async () => {
      const tokenSet: ITokenSet = {
        accessToken: 'access',
        refreshToken: 'refresh',
        accessTokenExpiryTime: 'date',
        sywToken: 'sywToken'
      };
      const deviceId = createUUID();
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(deviceId).mockResolvedValueOnce(tokenSet);
      const { result } = renderWrappedHook(() => useRestoreSession(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.nativeHelperService.storage.get).toBeCalledWith(ENV.STORAGE_KEY.GAME_CURRENT);
        expect(deps.apiService.setTokenSet).toBeCalledWith(tokenSet, deviceId);
        expect(result.current[3]).toEqual({ success: true });
      });
    });

    it('should NOT set tokens when the deviceId is not found', async () => {
      const { result } = renderWrappedHook(() => useRestoreSession());
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.apiService.setTokenSet).not.toBeCalled();
        expect(result.current[2]).toBeInstanceOf(Error);
        expect(result.current[2].message).toBe('No deviceId was found while restoring session.');
      });
    });

    it("should NOT set tokens when they don't exist", async () => {
      const deviceId = createUUID();
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(deviceId).mockResolvedValueOnce(null);
      const { result } = renderWrappedHook(() => useRestoreSession(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();

        expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(1, ENV.STORAGE_KEY.DEVICE_ID);
        expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(2, ENV.STORAGE_KEY.TOKEN_SET);
        expect(deps.apiService.setTokenSet).not.toBeCalled();
        expect(deps.logger.warn).not.toBeCalled();
        expect(deps.logger.debug).toHaveBeenCalledWith('useRestoreSession', expect.anything());
        expect(result.current[3]).toEqual({ success: false });
      });
    });

    it('should return success as false when the restoring process fails at any point', async () => {
      const tokenSet: ITokenSet = {
        accessToken: 'access',
        refreshToken: 'refresh',
        accessTokenExpiryTime: 'date',
        sywToken: 'sywToken'
      };
      const deviceId = createUUID();
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(deviceId).mockResolvedValueOnce(tokenSet);
      deps.apiService.registerDeviceInfo = Promise.reject;
      const { result } = renderWrappedHook(() => useRestoreSession(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(result.current[3]).toEqual({ success: false });
      });
    });

    it('should NOT remove sid stored without sid data', async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(null);
      const { result } = renderWrappedHook(() => useRestoreSession(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.nativeHelperService.storage.remove).not.toBeCalled();
      });
    });

    it('should NOT remove sid stored without inactive date', async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ sid: 'sid', inactiveDate: null });
      const { result } = renderWrappedHook(() => useRestoreSession(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.nativeHelperService.storage.remove).not.toBeCalled();
      });
    });

    it('should remove sid stored with a exceeded inactive date', async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ sid: 'sid', inactiveDate: '2021-07-20T12:00:00.000Z' });
      const { result } = renderWrappedHook(() => useRestoreSession(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.nativeHelperService.storage.remove).toBeCalledWith(ENV.STORAGE_KEY.SID);
      });
    });
  });

  describe('useAuthentication', () => {
    it('should NOT authenticate when a token is already present', async () => {
      const tokenSet: ITokenSet = {
        accessToken: 'access',
        refreshToken: 'refresh',
        accessTokenExpiryTime: 'date',
        sywToken: 'sywToken'
      };
      const deviceId = createUUID();
      deps.apiService.getTokenSetAsync = async () => tokenSet as any;
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(deviceId);
      const { result } = renderWrappedHook(() => useAuthentication(), deps);
      deps.stateSnapshot.get = () => initialState;
      await act(async () => {
        await (result.current[0] as () => Promise<void>)();
        expect(deps.apiService.setTokenSet).not.toBeCalled();
        await wait(0);
        expect(result.current[3]).toEqual(true);
      });
    });

    it('should not post user activity if the user is already a member of syw max', async () => {
      const deviceId = createUUID();
      const tokenSet: ITokenSet = {
        accessToken: 'access',
        refreshToken: 'refresh',
        accessTokenExpiryTime: null,
        expiresIn: 1000
      };
      deps.apiService.getTokenSetAsync = async () => null;
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(deviceId);
      deps.authService.webAuth.authorize = jest.fn().mockResolvedValue(tokenSet);
      const { result } = renderWrappedHook(() => useAuthentication(), deps);
      initialState.game.current.memberships.userIsSywMaxMember = true;
      deps.stateSnapshot.get = () => initialState;
      await act(async () => {
        await (result.current[0] as () => Promise<void>)();
        expect(deps.apiService.registerUserActivity).not.toBeCalled();
        expect(deps.eventTrackerService.appsFlyerSDK.trackConversionEvent).toBeCalledWith(ConversionEventType.LOGIN, expect.any(Object));
        expect(deps.eventTrackerService.appsFlyerSDK.trackConversionEvent).not.toBeCalledWith(ConversionEventType.REGISTER, expect.any(Object));
        expect(result.current[3]).toEqual(true);
      });
    });

    it('should authenticate with Auth0', async () => {
      Date.now = () => 1000;
      const tokenSet: ITokenSet = {
        accessToken: 'access',
        refreshToken: 'refresh',
        accessTokenExpiryTime: null,
        expiresIn: 1000
      };
      const deviceId = createUUID();
      deps.apiService.getTokenSetAsync = async () => null;
      deps.authService.webAuth.authorize = jest.fn().mockResolvedValue(tokenSet);
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(deviceId);
      const { result } = renderWrappedHook(() => useAuthentication(), deps);
      deps.stateSnapshot.get = () => initialState;
      await act(async () => {
        await (result.current[0] as () => Promise<void>)();
        expect(deps.nativeHelperService.storage.get).toBeCalledWith(ENV.STORAGE_KEY.DEVICE_ID);
        expect(deps.apiService.setTokenSet).toBeCalledWith({ ...tokenSet, accessTokenExpiryTime: new Date(1001000).toString() }, deviceId);
        expect(deps.apiService.registerUserActivity).toBeCalled();
        expect(deps.eventTrackerService.appsFlyerSDK.trackConversionEvent).toBeCalledWith(ConversionEventType.LOGIN, expect.any(Object));
        expect(deps.eventTrackerService.appsFlyerSDK.trackConversionEvent).toBeCalledWith(ConversionEventType.REGISTER, expect.any(Object));
        expect(result.current[3]).toEqual(true);
      });
    });

    it('should not authenticate with Auth0 error', async () => {
      const deviceId = createUUID();
      deps.apiService.getTokenSetAsync = async () => null;
      deps.authService.webAuth.authorize = jest.fn().mockRejectedValueOnce('error');
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(deviceId);
      const { result } = renderWrappedHook(() => useAuthentication(), deps);
      deps.stateSnapshot.get = () => initialState;
      await act(async () => {
        await (result.current[0] as () => Promise<void>)();
        expect(result.current[3]).toEqual(false);
        expect(deps.logger.error).toBeCalled();
      });
    });

    it('should not warn about errors if the user manually cancelled', async () => {
      const deviceId = createUUID();
      deps.apiService.getTokenSetAsync = async () => null;
      deps.authService.webAuth.authorize = jest
        .fn()
        .mockRejectedValueOnce({ error: 'a0.session.user_cancelled', error_description: 'User cancelled the Auth' });
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(deviceId);
      const { result } = renderWrappedHook(() => useAuthentication(), deps);
      deps.stateSnapshot.get = () => initialState;
      await act(async () => {
        await (result.current[0] as () => Promise<void>)();
        expect(deps.logger.error).not.toBeCalled();
      });
    });
  });

  describe('useLogout', () => {
    it('should logout softly', async () => {
      const { result } = renderWrappedHook(() => useLogout(true), deps);
      await waitFor(async () => {
        await result.current[0]();
        expect(deps.nativeHelperService.storage.remove).toBeCalled();
        expect(deps.logger.debug).toBeCalledWith('useCookies', 'clearAll');
        expect(deps.nativeHelperService.restart).not.toBeCalled();
      });
    });

    it('should logout with Auth0 (iOS)', async () => {
      deps.nativeHelperService.platform.OS = 'ios';
      const { result } = renderWrappedHook(() => useLogout(), deps);
      await waitFor(async () => {
        await result.current[0]();
        expect(deps.apiService.unregisterDeviceInfo).toBeCalled();
        expect(deps.nativeHelperService.storage.remove).toBeCalled();
        expect(deps.logger.debug).toBeCalledWith('useCookies', 'clearAll');
        expect(deps.nativeHelperService.restart).toBeCalled();
      });
    });

    it('should logout with Auth0 (android)', async () => {
      deps.nativeHelperService.platform.OS = 'android';
      const { result } = renderWrappedHook(() => useLogout(), deps);
      await waitFor(async () => {
        await result.current[0]();
        expect(deps.authService.webAuth.clearSession).toBeCalled();
        expect(deps.apiService.unregisterDeviceInfo).toBeCalled();
        expect(deps.nativeHelperService.storage.remove).toBeCalled();
        expect(deps.logger.debug).toBeCalledWith('useCookies', 'clearAll');
        expect(deps.nativeHelperService.restart).toBeCalled();
      });
    });

    it('should log an error when the logout fails', async () => {
      deps.apiService.unregisterDeviceInfo = jest.fn().mockRejectedValueOnce('error');
      const { result } = renderWrappedHook(() => useLogout(), deps);
      await waitFor(async () => {
        await result.current[0]();
        expect(deps.logger.error).toBeCalled();
      });
    });
  });
});

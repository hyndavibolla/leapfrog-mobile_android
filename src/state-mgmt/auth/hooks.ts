import { useContext } from 'react';

import { GlobalContext } from '../GlobalState';
import { ENV } from '../../constants/env';
import { useAsyncCallback } from '../../utils/useAsyncCallback';
import { IDeepLinkStoredSid } from '../../services/AppsFlyerService';
import { ITokenSet } from '../../models/general';
import { useGetProfile } from '../user/hooks';
import { useGetCurrentGame, useRestoreCurrentGame } from '../game/hooks';
import { useCCPA, useCookies, useErrorLog, useEventTracker, useRegisterDeviceInfo } from '../core/hooks';
import { UserActivityId, UserActivityType } from '../../services/ApiService';
import { ConversionEventType, ForterActionType, PageNames, PageType, ROUTES, TealiumEventType } from '../../constants';
import { wait } from '../../utils/wait';

export const useRestoreSession = (): [() => Promise<{ success: boolean }>, boolean, any, { success: boolean }] => {
  const { deps } = useContext(GlobalContext);
  const [fetchProfile] = useGetProfile(true);
  const [fetchCurrentGame] = useGetCurrentGame(true);
  const registerDeviceInfo = useRegisterDeviceInfo(true);
  const [restoreCurrentGame] = useRestoreCurrentGame();
  const { trackSystemEvent } = useEventTracker();

  const restoreSessionState = useAsyncCallback(async () => {
    const deviceId = await deps.nativeHelperService.storage.get<string>(ENV.STORAGE_KEY.DEVICE_ID);
    if (!deviceId) {
      const e = new Error('No deviceId was found while restoring session.');
      deps.logger.error(e);
      throw e;
    }

    const tokenSet = await deps.nativeHelperService.storage.get<ITokenSet>(ENV.STORAGE_KEY.TOKEN_SET);
    const storedSid = await deps.nativeHelperService.storage.get<IDeepLinkStoredSid>(ENV.STORAGE_KEY.SID);
    if (storedSid?.inactiveDate) await deps.nativeHelperService.storage.remove(ENV.STORAGE_KEY.SID);
    const hasTokenSet = !!(tokenSet?.accessToken && tokenSet?.accessTokenExpiryTime && tokenSet?.refreshToken);
    deps.logger.debug('useRestoreSession', { tokenSet, hasTokenSet, deviceId });
    if (!hasTokenSet) return { success: false };

    try {
      await deps.apiService.setTokenSet(tokenSet, deviceId);
      await restoreCurrentGame();
      await registerDeviceInfo();
      await Promise.all([fetchProfile(), fetchCurrentGame()]);
      setTimeout(async () => {
        trackSystemEvent(
          TealiumEventType.LAUNCH,
          {
            page_name: PageNames.MAIN.EARN,
            page_type: PageType.TOP,
            address: `${ENV.SCHEME}${ROUTES.MAIN_TAB.EARN}`,
            user_type: await deps.nativeHelperService.getRuntimeEnv()
          },
          ForterActionType.APP_ACTIVE,
          { action: 'app launch' }
        );
      }, ENV.TRACK_EVENT_DELAY_MS);
      return { success: true };
    } catch (error) {
      deps.logger.error(error, { context: 'Error restoring session', tokenSet });
      return { success: false };
    }
  }, []);
  return restoreSessionState;
};

export const useAuthentication = (): [() => Promise<boolean>, boolean, any, boolean] => {
  const { deps } = useContext(GlobalContext);
  const [fetchProfile] = useGetProfile(true);
  const [fetchCurrentGame] = useGetCurrentGame(true);
  const registerDeviceInfo = useRegisterDeviceInfo(true);
  const [restoreCurrentGame] = useRestoreCurrentGame();
  const { trackSystemEvent, trackConversionEvent } = useEventTracker();
  const { showBanner } = useCCPA();

  const authenticationState = useAsyncCallback(async () => {
    deps.logger.debug('useAuthentication');
    if (await deps.apiService.getTokenSetAsync()) return true; // prevents re-authentication when a token/device id is already set
    const deviceId = await deps.nativeHelperService.storage.get<string>(ENV.STORAGE_KEY.DEVICE_ID);
    let tokenSet: ITokenSet;

    try {
      const credentials = await deps.authService.webAuth.authorize(
        { scope: ENV.AUTH0.SCOPE, audience: ENV.AUTH0.AUDIENCE, prompt: 'login' },
        { ephemeralSession: true }
      );
      tokenSet = {
        ...credentials,
        accessTokenExpiryTime: new Date(Date.now() + credentials.expiresIn * 1000).toString(),
        refreshToken: credentials.refreshToken
      };
      await deps.apiService.setTokenSet(tokenSet, deviceId);
    } catch (error: any) {
      if (error?.error === 'a0.session.user_cancelled') {
        deps.logger.info('User cancelled authentication', { error });
        return false;
      }

      deps.logger.error('Could not authenticate user', { auth0Error: error, context: 'Auth0 Authorize error' });
      return false;
    }

    const [onShowBanner] = showBanner;

    await deps.apiService.setTokenSet(tokenSet, deviceId);
    await restoreCurrentGame();
    await registerDeviceInfo();
    await Promise.all([fetchProfile(), fetchCurrentGame()]);
    await onShowBanner();

    const { userIsSywMaxMember } = deps.stateSnapshot.get().game.current.memberships;
    const activityId = UserActivityId.USER_ONBOARDED;
    const sywUserId = deps.stateSnapshot.get().user.currentUser.sywUserId;
    if (!userIsSywMaxMember) {
      await deps.apiService.registerUserActivity([deviceId], UserActivityType.MAX_ONBOARDING, [{ activityId }]);
      trackConversionEvent(ConversionEventType.REGISTER, { member_id: sywUserId });
      deps.eventTrackerService.rZero.trackEvent('user_registered');
    }

    trackConversionEvent(ConversionEventType.LOGIN, { member_id: sywUserId });
    trackSystemEvent(
      TealiumEventType.LOGIN,
      {
        page_name: PageNames.MAIN.EARN,
        page_type: PageType.TOP,
        address: `${ENV.SCHEME}${ROUTES.MAIN_TAB.EARN}`
      },
      ForterActionType.ACCOUNT_LOGIN,
      {}
    );

    deps.eventTrackerService.rZero.trackEvent('user_logged_in');
    return true;
  }, []);
  useErrorLog(authenticationState[2], 'Error authenticating');
  return authenticationState;
};

export const useLogout = (soft?: boolean) => {
  const { deps } = useContext(GlobalContext);
  const { clearAll } = useCookies();
  const { trackSystemEvent } = useEventTracker();
  return useAsyncCallback<any, boolean>(async () => {
    deps.logger.debug('useLogout', { soft: !!soft });
    trackSystemEvent(
      TealiumEventType.LOGOUT,
      {
        '5321_cardmember': undefined,
        syw_id: undefined,
        member_level: undefined,
        pending_points: undefined,
        balance_points: undefined
      },
      ForterActionType.ACCOUNT_LOGOUT,
      {}
    );
    const [onClearCookies] = clearAll;
    await Promise.all([
      deps.nativeHelperService.deviceInfo.getDeviceTokenAsync(),
      ...Object.values(ENV.STORAGE_KEY)
        .filter(
          key =>
            ![
              ENV.STORAGE_KEY.DEVICE_ID,
              ENV.STORAGE_KEY.CCPA_SETTING,
              ENV.STORAGE_KEY.ONBOARDING,
              ENV.STORAGE_KEY.VIEWED_TOOLTIP_LIST,
              ENV.STORAGE_KEY.API_OVERRIDE_SETTINGS,
              ENV.STORAGE_KEY.LOG_SETTINGS,
              ENV.STORAGE_KEY.FORCED_TO_LOGOUT
            ].includes(key)
        )
        .map(deps.nativeHelperService.storage.remove),
      /** workaround to allow local storage cleanup to run on slower devices */
      wait(ENV.STORAGE_CLEAN_WAIT),
      onClearCookies()
    ] as Promise<any>[]);

    if (soft) return true;
    /** code below is meant to be used for full logout functionality */

    try {
      if (deps.nativeHelperService.platform.OS === 'android') await deps.authService.webAuth.clearSession();
      await deps.nativeHelperService.storage.remove(ENV.STORAGE_KEY.TOKEN_SET);
      await deps.apiService.unregisterDeviceInfo();
    } catch (error) {
      deps.logger.error(error, { context: 'Error registering logout... moving on' });
    }

    deps.nativeHelperService.restart();
    return true;
  }, []);
};

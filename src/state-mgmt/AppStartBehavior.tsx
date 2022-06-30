import React, { memo, MutableRefObject, PropsWithChildren, useContext, useEffect } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

import { CriticalError } from '_components/CriticalError';
import { EnvBanner } from '_components/EnvBanner';
import { ENV } from '_constants';
import { ITokenSet } from '_models/general';
import { createUUID } from '_utils/create-uuid';
import getInitialActionNavigation from '_utils/getInitialActionNavigation';
import { useAsyncCallback } from '_utils/useAsyncCallback';
import { wait } from '_utils/wait';
import { useRestoreSession } from './auth/hooks';
import { actions as coreActions } from './core/actions';
import { useOnboarding } from './core/hooks';
import { GlobalContext } from './GlobalState';

export interface Props {
  navigationRef: MutableRefObject<NavigationContainerRef>;
}

const AppStartBehavior = memo(({ children, navigationRef }: PropsWithChildren<Props>) => {
  const { state, dispatch, deps } = useContext(GlobalContext);
  const { restoreSeenOnboarding: restoreSeenOnboarding } = useOnboarding();
  const [onRestoreSeenOnboarding] = restoreSeenOnboarding;
  const [restoreSession, , errorRestoring, sessionResponse] = useRestoreSession();
  const [onGetInitialURL, isGettingInitialUrl = true, , initialUrl] = useAsyncCallback<any, string>(deps.nativeHelperService.linking.getInitialURL, []);
  const [waitForSplash, isWaitingForSplash] = useAsyncCallback(() => wait(ENV.SPLASH_MIN_ANIMATION_TIME_MS), []);

  const [migrateToPermanentDeviceId] = useAsyncCallback(async () => {
    /**
     * This code migrates the tokenSet.deviceId to the permanent deviceId
     * This change was introduced in 1.3.0, so the old tokenSet.deviceId needs to
     * be supported until all customers move over.
     */
    const tokenSet = await deps.nativeHelperService.storage.get<ITokenSet>(ENV.STORAGE_KEY.TOKEN_SET);
    if (!tokenSet?.deviceId) return;

    const { deviceId, ...newTokenSet } = tokenSet;
    deps.logger.info('Migrating deviceId from tokenSet to permanent storage', { tokenSet: newTokenSet, deviceId });
    await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.TOKEN_SET, newTokenSet);
    await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.DEVICE_ID, deviceId);
  }, [deps.nativeHelperService.storage, deps.logger]);

  const [generatePermanentDeviceId] = useAsyncCallback(async () => {
    const deviceId = await deps.nativeHelperService.storage.get<string>(ENV.STORAGE_KEY.DEVICE_ID);
    if (deviceId) return;

    const newDeviceId = createUUID();
    await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.DEVICE_ID, newDeviceId);
    await deps.nativeHelperService.storage.remove(ENV.STORAGE_KEY.TOKEN_SET);
    deps.logger.info('Generated new deviceId', { newDeviceId });
    deps.eventTrackerService.rZero.trackEvent('app_installed');
  }, [deps.nativeHelperService.storage, deps.logger]);

  useEffect(() => {
    waitForSplash();
    onGetInitialURL();

    migrateToPermanentDeviceId().then(generatePermanentDeviceId).then(onRestoreSeenOnboarding).then(restoreSession);
  }, [restoreSession, waitForSplash, onRestoreSeenOnboarding, onGetInitialURL, migrateToPermanentDeviceId, generatePermanentDeviceId]);

  useEffect(() => {
    if (
      !navigationRef.current ||
      !state.core.isDeepLinkListenerReady ||
      state.core.isAppReady ||
      isWaitingForSplash ||
      typeof sessionResponse?.success !== 'boolean' ||
      isGettingInitialUrl
    )
      return;

    let initialData;
    if (state.core.deepLink) {
      initialData = {
        deepLink: {
          ...state.core.deepLink
        }
      };
    } else {
      initialData = {
        initialUrl
      };
    }

    const { action, route, params } = getInitialActionNavigation(
      sessionResponse.success,
      state.core.hasSeenOnboarding,
      state.core.showForcedUpdateScreen,
      initialData
    );

    navigationRef.current.dispatch(action);

    deps.logger.info('App initialized');
    deps.logger.debug('App initialized', { route, params, initialUrl });

    dispatch(coreActions.setIsAppReady(true));
  }, [
    deps.logger,
    dispatch,
    initialUrl,
    isGettingInitialUrl,
    isWaitingForSplash,
    navigationRef,
    sessionResponse,
    state.core.deepLink,
    state.core.hasSeenOnboarding,
    state.core.isAppReady,
    state.core.isDeepLinkListenerReady,
    state.core.showForcedUpdateScreen
  ]);

  if (errorRestoring)
    return (
      <>
        <EnvBanner />
        <CriticalError />
      </>
    );
  return <>{children}</>;
});

export default AppStartBehavior;

import { useContext, useState, useEffect, useCallback, useMemo } from 'react';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useEventTracker } from '_state_mgmt/core/hooks';

import { ForterActionType, TealiumEventType, UxObject, PageNames } from '_constants';

export const usePushNotificationsPermission = () => {
  const [notificationsPermissions, setNotificationsPermissions] = useState('');
  const { trackUserEvent } = useEventTracker();

  const {
    deps: {
      logger,
      nativeHelperService: {
        platform: { OS },
        reactNativePermission: {
          RESULTS: { GRANTED, DENIED },
          checkNotifications,
          openSettings
        },
        appState: { addEventListener },
        messaging: { requestPermission },
        pushNotificationsAuthStatus
      }
    }
  } = useContext(GlobalContext);

  const notificationsEnabled = useMemo(() => {
    return notificationsPermissions === GRANTED;
  }, [GRANTED, notificationsPermissions]);

  const trackPNPreference = useCallback(
    newStatus => {
      if (notificationsPermissions !== newStatus) {
        trackUserEvent(
          TealiumEventType.SET_PN_PREFERENCE,
          {
            page_name: PageNames.PROFILE.MAIN,
            uxObject: UxObject.BUTTON,
            event_name: TealiumEventType.SET_PN_PREFERENCE,
            event_type: newStatus === GRANTED ? 'enabled' : 'disabled'
          },
          ForterActionType.TAP
        );
      }
    },
    [notificationsPermissions, GRANTED, trackUserEvent]
  );

  const handleNotificationPermissionCheck = useCallback(async () => {
    try {
      const { status } = await checkNotifications();
      trackPNPreference(status);
      setNotificationsPermissions(status);
      return status;
    } catch (error) {
      logger.error('Error handle Push Notifications Permission Check', { error });
    }
  }, [checkNotifications, logger, trackPNPreference]);

  const handlePushNotifications = useCallback(async () => {
    if (OS === 'ios' && !notificationsEnabled) {
      try {
        const authStatus = await requestPermission();
        const arePNEnabled = [pushNotificationsAuthStatus.AUTHORIZED, pushNotificationsAuthStatus.PROVISIONAL, true].includes(authStatus);
        const arePNRejected = [pushNotificationsAuthStatus.DENIED, false].includes(authStatus);
        const isFirstAllow = notificationsPermissions === DENIED && arePNRejected;
        if (!arePNEnabled && !isFirstAllow) openSettings();
        if (isFirstAllow) {
          trackPNPreference(DENIED);
        }
      } catch (error) {
        logger.error('Error requesting push notifications permission for ios', { error });
      }
    } else {
      openSettings();
    }
  }, [
    OS,
    notificationsEnabled,
    requestPermission,
    pushNotificationsAuthStatus.AUTHORIZED,
    pushNotificationsAuthStatus.PROVISIONAL,
    pushNotificationsAuthStatus.DENIED,
    notificationsPermissions,
    DENIED,
    openSettings,
    trackPNPreference,
    logger
  ]);

  useEffect(() => {
    async function handleChange() {
      await handleNotificationPermissionCheck();
    }

    const subscription = addEventListener('change', state => {
      if (state === 'active') {
        handleChange();
      }
    });
    return () => {
      subscription && subscription.remove();
    };
  }, [addEventListener, handleNotificationPermissionCheck]);

  return { handleNotificationPermissionCheck, handlePushNotifications, notificationsEnabled };
};

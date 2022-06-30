import { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';

import { GlobalContext } from '_state_mgmt/GlobalState';

export function useLocationPermission() {
  const [permissionStatus, setPermissionStatus] = useState('');
  const isFocused = useIsFocused();

  const {
    state: {
      user: {
        currentUser: {
          personal: {
            currentLocation: { zip }
          }
        }
      }
    },
    deps: {
      logger,
      nativeHelperService: {
        platform: { OS },
        reactNativePermission: {
          PERMISSIONS: {
            IOS: { LOCATION_WHEN_IN_USE, LOCATION_ALWAYS },
            ANDROID: { ACCESS_FINE_LOCATION }
          },
          RESULTS: { BLOCKED, DENIED, GRANTED },
          check,
          checkMultiple,
          request
        },
        appState: { addEventListener }
      }
    }
  } = useContext(GlobalContext);

  const handleLocationPermissionCheck = useCallback(async () => {
    try {
      if (OS === 'ios') {
        const statuses = await checkMultiple([LOCATION_WHEN_IN_USE, LOCATION_ALWAYS]);
        if (statuses[LOCATION_ALWAYS] === BLOCKED) {
          setPermissionStatus(statuses[LOCATION_WHEN_IN_USE]);
          return statuses[LOCATION_WHEN_IN_USE];
        }
        setPermissionStatus(statuses[LOCATION_ALWAYS]);
        return statuses[LOCATION_ALWAYS];
      } else {
        const status = await check(ACCESS_FINE_LOCATION);
        setPermissionStatus(status);
        return status;
      }
    } catch (error) {
      logger.error('Error handle Location Permission Check', { error });
    }
  }, [ACCESS_FINE_LOCATION, BLOCKED, LOCATION_ALWAYS, LOCATION_WHEN_IN_USE, OS, check, checkMultiple, logger]);

  const handleLocationPermission = useCallback(async () => {
    try {
      const permission = OS === 'ios' ? LOCATION_ALWAYS : ACCESS_FINE_LOCATION;
      const status = await check(permission);
      if (status === DENIED) {
        await request(permission);
        return handleLocationPermissionCheck();
      }
      setPermissionStatus(status);
      return status;
    } catch (error) {
      logger.error('Error handle Location Permission', { error });
    }
  }, [ACCESS_FINE_LOCATION, DENIED, LOCATION_ALWAYS, OS, check, handleLocationPermissionCheck, logger, request]);

  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      await handleLocationPermissionCheck();
    })();
  }, [handleLocationPermissionCheck, isFocused]);

  useEffect(() => {
    async function handleChange() {
      await handleLocationPermissionCheck();
    }
    const subscription = addEventListener('change', handleChange);
    return () => {
      subscription.remove();
    };
  }, [addEventListener, handleLocationPermissionCheck]);

  const isLocationAvailable = useMemo(() => {
    return permissionStatus === GRANTED || !!zip;
  }, [GRANTED, permissionStatus, zip]);

  const isLocationBlocked = useMemo(() => {
    return permissionStatus === BLOCKED;
  }, [BLOCKED, permissionStatus]);

  return { handleLocationPermission, handleLocationPermissionCheck, isLocationAvailable, isLocationBlocked, permissionStatus };
}

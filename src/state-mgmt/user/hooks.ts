import { useContext } from 'react';

import { GlobalContext } from '../GlobalState';
import { actions } from './actions';
import { useAsyncCallback } from '../../utils/useAsyncCallback';
import { useErrorLog } from '../core/hooks';
import { IUser } from '_models/user';

export const useGetProfile = (throwOnRejection?: boolean) => {
  const { dispatch, deps } = useContext(GlobalContext);
  const [toggleUserTracking] = useToggleUserTracking();
  const profileState = useAsyncCallback(
    async () => {
      deps.logger.info('Getting user profile');
      const user = await deps.apiService.fetchUserProfile();
      await toggleUserTracking(user);
      dispatch(actions.setCurrentUser(user));
    },
    [deps.apiService.fetchUserProfile],
    throwOnRejection
  );
  useErrorLog(profileState[2], 'There was an issue fetching the user profile');
  return profileState;
};

export const useToggleUserTracking = () => {
  const { deps } = useContext(GlobalContext);

  const toggleUserTracking = useAsyncCallback(async (user?: IUser) => {
    const isTrackingEnabled = await deps.eventTrackerService.isTrackingEnabled();
    await Promise.all([
      deps.crashlyticsService.setCrashlyticsCollectionEnabled(isTrackingEnabled),
      deps.performanceTrackingService.setPerformanceCollectionEnabled(isTrackingEnabled)
    ]);
    if (isTrackingEnabled) {
      const currentUser = user ?? (await deps.apiService.fetchUserProfile());
      const trackingAttributes = {
        sywUserId: currentUser.sywUserId,
        sywMemberNumber: currentUser.personal.sywMemberNumber
      };
      await deps.performanceTrackingService.initialize(trackingAttributes);
      await deps.crashlyticsService.initialize(currentUser.sywUserId, trackingAttributes);
      await deps.eventTrackerService.trackDataUser(currentUser.email, currentUser.sywUserId, currentUser.personal.sywMemberNumber);
    }
  }, []);

  useErrorLog(toggleUserTracking[2], 'There was an issue tracking the user');
  return toggleUserTracking;
};

export const useSendValidationEmail = () => {
  const { deps } = useContext(GlobalContext);
  const sendValidationEmail = useAsyncCallback(async () => {
    deps.logger.info('Sending validation email');
    await deps.apiService.sendValidationEmail();
    deps.eventTrackerService.rZero.trackEvent('user_started_email_verification');
    return true;
  }, [deps.apiService.sendValidationEmail]);

  useErrorLog(sendValidationEmail[2], 'There was an issue sending the validation email');
  return sendValidationEmail;
};

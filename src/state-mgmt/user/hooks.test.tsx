import { act } from '@testing-library/react-hooks';

import { getMockDeps } from '../../test-utils/getMockDeps';
import { useGetProfile } from './hooks';
import { Deps } from '../../models/general';
import { actions } from './actions';
import { getUser } from '../../test-utils/entities';
import { renderWrappedHook } from '../../test-utils/renderWrappedHook';

describe('user hooks', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  describe('useGetProfile', () => {
    it('should fetch and set the user profile', async () => {
      const user = getUser();
      deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue(user);
      const { result, mockReducer } = renderWrappedHook(() => useGetProfile(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.crashlyticsService.setCrashlyticsCollectionEnabled).toBeCalled();
        expect(deps.apiService.fetchUserProfile).toBeCalled();
        expect(deps.crashlyticsService.initialize).toBeCalledWith(user.sywUserId, {
          sywUserId: user.sywUserId,
          sywMemberNumber: user.personal.sywMemberNumber
        });
        expect(deps.eventTrackerService.trackDataUser).toBeCalledWith(user.email, user.sywUserId, user.personal.sywMemberNumber);
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setCurrentUser(getUser()));
      });
    });

    it('should not fetch and set the user profile if tracking is disabled', async () => {
      deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue(getUser());
      deps.eventTrackerService.isTrackingEnabled = jest.fn().mockResolvedValue(false);
      const { result } = renderWrappedHook(() => useGetProfile(), deps);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.crashlyticsService.initialize).not.toBeCalled();
      });
    });
  });
});

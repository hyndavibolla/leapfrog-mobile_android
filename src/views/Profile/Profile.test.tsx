import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
const { RESULTS } = require('react-native-permissions/mock');

import { Profile } from './Profile';

import { getInitialState } from '_state_mgmt/GlobalState';
import { Deps, IGlobalState } from '_models/general';

import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getStateSnapshotStorage } from '_utils/getStateSnapshotStorage';
import { ENV, ROUTES } from '_constants';

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: jest.fn() })
}));

jest.useFakeTimers('legacy');
jest.spyOn(global, 'setTimeout');

describe('Profile', () => {
  console.error = () => null;
  let deps: Deps;
  let props: any;
  let initState: IGlobalState;

  beforeEach(() => {
    props = {
      navigation: { navigate: jest.fn() } as any
    };

    initState = getInitialState();
    deps = getMockDeps();
    deps.stateSnapshot = getStateSnapshotStorage();
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render with avatarUrl', async () => {
    initState.user.currentUser.avatarUrl = 'http://www.fakeavatar.com/';

    const { toJSON } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should open SYW site', async () => {
    const { getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-row-item-edit-profile'));
    await waitFor(() => {
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.EDIT_PROFILE, { uri: `${ENV.SYW_URL}m/dashboard/account?intcmp=iMAXxEditProfile` });
    });
  });

  it('should check push notifications permissions (iOS)', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    (deps.nativeHelperService.reactNativePermission.checkNotifications as jest.Mock).mockReturnValue({ status: RESULTS.DENIED });
    const { findByTestId, getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);
    fireEvent.press(getByTestId('profile-row-item-push-notifications'));
    expect(await findByTestId('profile-row-item-push-notifications-value')).toHaveTextContent('OFF');
  });

  it('should check push notifications permissions (android)', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.checkNotifications as jest.Mock).mockReturnValue({ status: RESULTS.GRANTED });
    const { findByTestId, getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);
    fireEvent.press(getByTestId('profile-row-item-push-notifications'));
    expect(await findByTestId('profile-row-item-push-notifications-value')).toHaveTextContent('ON');
  });

  it('should open your pin number modal', async () => {
    const { getByTestId, findByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-row-item-member-number-pin'));
    expect(await findByTestId('point-balance-modal-container')).toBeTruthy();
    fireEvent.press(getByTestId('modal-backdrop'));
  });

  it('should navigate to how it work points', async () => {
    const { getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-row-item-how-points-work'));
    await waitFor(() => {
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.HOW_IT_WORKS.TITLE);
    });
  });

  it('should navigate to how it work faqs', async () => {
    const { getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-row-item-faqs'));
    await waitFor(() => {
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.HOW_IT_WORKS.TITLE, { screen: ROUTES.HOW_IT_WORKS.FAQ });
    });
  });

  it('should navigate to terms and conditions', async () => {
    const { getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-row-item-terms-and-conditions'));
    await waitFor(() => {
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.TERMS_AND_CONDITIONS);
    });
  });

  it('should navigate to privacy policy', async () => {
    const { getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-row-item-privacy-policy'));
    await waitFor(() => {
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.PRIVACY_POLICY);
    });
  });

  it('should open and close sign out modal', async () => {
    const { toJSON, getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-sign-out'));
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
    fireEvent.press(getByTestId('modal-backdrop'));
  });

  it('should open sign out modal and sign out', async () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-sign-out'));
    fireEvent.press(getByTestId('profile-modal-sign-out'));

    jest.runAllTimers();

    await waitFor(() => {
      expect(deps.logger.debug).toBeCalledWith('useLogout', { soft: false });
      expect(queryByTestId('profile-modal-sign-out')).toBeNull();
    });
  });

  it('should open and close sign out modal with cancel link', async () => {
    const { toJSON, getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-sign-out'));
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
    fireEvent.press(getByTestId('profile-modal-cancel-sign-out'));
    expect(deps.logger.debug).not.toBeCalledWith('useLogout', { soft: false });
  });

  it('should open delete account modal', () => {
    const { getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-delete-account'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.DELETE_ACCOUNT);
  });

  it('should trigger a clean ccpa banner', async () => {
    const { getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-row-item-ccpa-btn'));
    await waitFor(() => {
      expect(deps.logger.debug).toBeCalledWith('resetSetting');
      expect(deps.logger.debug).toBeCalledWith('showBanner');
    });
  });

  it('should open contact support link', async () => {
    const { getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);
    fireEvent.press(getByTestId('profile-support-email'));

    await waitFor(() => {
      expect(deps.nativeHelperService.linking.openURL).toBeCalledWith(`mailto:${ENV.SYW_SUPPORT_EMAIL}?subject=SYW MAX - Customer Support`);
    });
  });

  it('should open SYW site with sid tracking parameters', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce({ sid: 'sid', inactiveDate: null });

    const { getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-row-item-edit-profile'));
    await waitFor(() => {
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.EDIT_PROFILE, { uri: `${ENV.SYW_URL}m/dashboard/account?intcmp=iMAXxEditProfile&sid=sid` });
    });
  });

  it('should open SYW site without sid tracking parameters', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(null);

    const { getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);
    fireEvent.press(getByTestId('profile-row-item-edit-profile'));

    await waitFor(() => {
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.EDIT_PROFILE, { uri: `${ENV.SYW_URL}m/dashboard/account?intcmp=iMAXxEditProfile` });
    });
  });

  it('should open SYW site without sid tracking parameters for inactive time exceeds', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce({ sid: 'sid', inactiveDate: '2021-07-20T12:00:00.000Z' });

    const { getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-row-item-edit-profile'));
    await waitFor(() => {
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.EDIT_PROFILE, { uri: `${ENV.SYW_URL}m/dashboard/account?intcmp=iMAXxEditProfile` });
    });
  });

  it('should navigate to edit profile webview', async () => {
    deps.nativeHelperService.linking.checkURLScheme = jest.fn().mockResolvedValueOnce(true);
    const { findByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);
    const editProfileButton = await findByTestId('profile-row-item-edit-profile');
    fireEvent.press(editProfileButton);
    await waitFor(() => {
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.EDIT_PROFILE, { uri: expect.any(String) });
    });
  });

  it('should show row app tutorial and navigate to earn', async () => {
    initState.core.isTutorialAvailable = true;
    const { getByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    fireEvent.press(getByTestId('profile-row-item-app-tutorial'));
    await waitFor(() => {
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.MAIN_TAB.EARN, { isShowTutorial: true });
    });
  });

  it('should not show row app tutorial', () => {
    initState.core.isTutorialAvailable = false;
    const { queryByTestId } = renderWithGlobalContext(<Profile {...props} />, deps, initState);

    expect(queryByTestId('profile-row-item-app-tutorial')).toBeNull();
  });
});

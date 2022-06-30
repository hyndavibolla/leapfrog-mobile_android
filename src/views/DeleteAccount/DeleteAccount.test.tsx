import React from 'react';
import DeleteAccount from './DeleteAccount';
import { fireEvent } from '@testing-library/react-native';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { Deps } from '_models/general';
import { ENV } from '_constants/env';
import { getMockDeps } from '_test_utils/getMockDeps';
import { getInitialState } from '_state_mgmt/GlobalState';

describe('DeleteAccount', () => {
  let initialState = getInitialState();
  let deps: Deps;

  beforeEach(() => {
    initialState.user.currentUser.personal.sywMemberNumber = '1234';
    deps = getMockDeps();
  });
  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<DeleteAccount />);
    expect(toJSON()).toMatchSnapshot();
  });
  it('should open contact support link', () => {
    const { getByTestId } = renderWithGlobalContext(<DeleteAccount />, deps, initialState);
    fireEvent.press(getByTestId('delete-account-support-email'));
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith(
      `mailto:${ENV.SYW_SUPPORT_EMAIL}?subject=Account Deletion Request&body=1234 has requested that their account be deleted.`
    );
  });
});

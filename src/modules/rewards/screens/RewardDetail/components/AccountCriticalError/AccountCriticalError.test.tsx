import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';
import AccountCriticalError, { Props } from './AccountCriticalError';

describe('AccountCriticalError', () => {
  let props: Props;
  beforeEach(() => {
    props = {};
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<AccountCriticalError {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without sign out link', () => {
    props.hideSignOut = true;
    const { toJSON } = renderWithGlobalContext(<AccountCriticalError {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should open a link', async () => {
    const { getByTestId, deps } = renderWithGlobalContext(<AccountCriticalError {...props} />);
    fireEvent.press(getByTestId('account-critical-error-link'));
    expect(deps.nativeHelperService.linking.openURL).toHaveBeenCalled();
    await act(() => wait(0));
  });

  it('should sign out', async () => {
    const { getByTestId, deps } = renderWithGlobalContext(<AccountCriticalError {...props} />);
    fireEvent.press(getByTestId('account-critical-error-logout-btn'));
    expect(deps.logger.debug).toBeCalledWith('useLogout', { soft: false });
    await act(() => wait(0));
  });
});

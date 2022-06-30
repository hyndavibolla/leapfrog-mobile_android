import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

import { Props, YourPinNumberModal } from './YourPinNumberModal';
import { wait } from '../../../utils/wait';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { IGlobalState } from '../../../models/general';
import { getInitialState } from '../../../state-mgmt/GlobalState';

describe('YourPinNumberModal', () => {
  let props: Props;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    props = {
      visible: true,
      onClose: jest.fn()
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<YourPinNumberModal {...props} />, undefined, initialState);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should open and close barcode modal', async () => {
    initialState.user.currentUser.personal = { ...initialState.user.currentUser.personal, sywMemberNumber: '123456789012345', sywPinNumber: '12345' };
    const { getByTestId } = renderWithGlobalContext(<YourPinNumberModal {...props} />, undefined, initialState, () => initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId('modal-backdrop'));
    await act(() => wait(0));
    expect(props.onClose).toBeCalled();
  });
});

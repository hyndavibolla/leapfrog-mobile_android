import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

import { wait } from '../../utils/wait';
import { renderWithGlobalContext } from '../../test-utils/renderWithGlobalContext';
import { NotificationModal, Props } from './NotificationModal';
import { getMockDeps } from '../../test-utils/getMockDeps';
import { Deps } from '../../models/general';

describe('NotificationModal', () => {
  let props: Props;
  let deps: Deps;

  beforeEach(() => {
    props = {
      onConfirm: jest.fn().mockResolvedValue(false),
      onCancel: jest.fn(),
      arePNRejected: false
    };
    deps = getMockDeps();
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<NotificationModal {...props} />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should confirm', async () => {
    const { getByTestId } = renderWithGlobalContext(<NotificationModal {...props} />);
    await act(() => wait(0));
    fireEvent.press(getByTestId('notification-modal-accept-btn'));
    expect(props.onConfirm).toBeCalled();
  });

  it('should cancel', async () => {
    const { getByTestId } = renderWithGlobalContext(<NotificationModal {...props} />);
    await act(() => wait(0));
    fireEvent.press(getByTestId('notification-modal-cancel-btn'));
    expect(props.onCancel).toBeCalled();
  });

  it('should render the recovery flow', async () => {
    props.arePNRejected = true;
    const { toJSON, getByTestId } = renderWithGlobalContext(<NotificationModal {...props} />);
    await act(() => wait(0));
    fireEvent.press(getByTestId('notification-modal-accept-btn'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should go to app settings', async () => {
    props.arePNRejected = true;
    const { getByTestId } = renderWithGlobalContext(<NotificationModal {...props} />, deps);
    await act(() => wait(0));
    fireEvent.press(getByTestId('notification-modal-accept-btn'));
    fireEvent.press(getByTestId('notification-modal-settings-btn'));
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith('app-settings:');
  });
});

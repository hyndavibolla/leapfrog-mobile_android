import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import { StatusConfirmationModal, Props } from './StatusConfirmationModal';
import { statusType } from '_models/giftCard';

describe('StatusConfirmationModal', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      name: 'Spotify',
      isVisible: true,
      isLoading: false,
      status: statusType.ACTIVE,
      onDismiss: jest.fn(),
      onSuccess: jest.fn()
    };
  });

  it('should call onSuccess when press confirm button', () => {
    const { getByTestId } = renderWithGlobalContext(<StatusConfirmationModal {...props} />);
    fireEvent.press(getByTestId('archive-confirmation-modal-confirm-button'));
    expect(props.onSuccess).toBeCalled();
  });

  it('should call onDismiss and close modal when press confirm button', () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<StatusConfirmationModal {...props} />);
    fireEvent.press(getByTestId('archive-confirmation-modal-cancel-button'));
    expect(props.onDismiss).toBeCalled();
    expect(queryByTestId('archive-confirmation-modal')).toBeNull();
  });

  it('should call onDismiss and close modal when press outside modal', () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<StatusConfirmationModal {...props} />);
    fireEvent.press(getByTestId('modal-backdrop'));
    expect(props.onDismiss).toBeCalled();
    expect(queryByTestId('archive-confirmation-modal')).toBeNull();
  });

  it('should render indicator', () => {
    props.isLoading = true;
    const { getByTestId } = renderWithGlobalContext(<StatusConfirmationModal {...props} />);
    expect(getByTestId('archive-confirmation-modal-indicator')).toBeTruthy();
  });
});

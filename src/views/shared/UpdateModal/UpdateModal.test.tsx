import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

import UpdateModal from './UpdateModal';

describe('UpdateModal', () => {
  it('should render a with a required update', () => {
    const { toJSON } = renderWithGlobalContext(<UpdateModal isUpdateRequired={true} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a without a required update', () => {
    const { toJSON } = renderWithGlobalContext(<UpdateModal isUpdateRequired={false} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should have a pressable skip button', () => {
    const fn = jest.fn();
    const { getByTestId } = renderWithGlobalContext(<UpdateModal isUpdateRequired={false} onClose={fn} />);
    fireEvent.press(getByTestId('update-modal-close-btn'));
    expect(fn).toBeCalled();
  });

  it('should have a button to redirect to the stores', () => {
    const { getByTestId, deps } = renderWithGlobalContext(<UpdateModal isUpdateRequired={false} />);
    fireEvent.press(getByTestId('update-modal-update-btn'));
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith(expect.any(String));
  });
});

import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import Unifimoney from '_views/Unifimoney/Unifimoney';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { ROUTES } from '_constants/routes';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('Unifimoney', () => {
  it('should render', () => {
    const { getByTestId, toJSON } = renderWithGlobalContext(<Unifimoney />);
    expect(getByTestId('unifimoney-container')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should open unlink modal', () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<Unifimoney />);
    expect(queryByTestId('unifimoney-modal-container')).toBeNull();
    fireEvent.press(getByTestId('unifimoney-unlink'));
    expect(getByTestId('unifimoney-modal-container')).toBeTruthy();
  });

  it('should close unlink modal when the cancel button was pressed', () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<Unifimoney />);
    expect(queryByTestId('unifimoney-modal-container')).toBeNull();
    fireEvent.press(getByTestId('unifimoney-unlink'));
    expect(getByTestId('unifimoney-modal-container')).toBeTruthy();
    fireEvent.press(getByTestId('unifimoney-modal-cancel'));
    expect(queryByTestId('unifimoney-modal-container')).toBeNull();
  });

  it('should close unlink modal and go to profile when the unlink button was pressed', () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<Unifimoney />);
    expect(queryByTestId('unifimoney-modal-container')).toBeNull();
    fireEvent.press(getByTestId('unifimoney-unlink'));
    expect(getByTestId('unifimoney-modal-container')).toBeTruthy();
    fireEvent.press(getByTestId('unifimoney-modal-button'));
    expect(queryByTestId('unifimoney-modal-container')).toBeNull();
    expect(mockNavigate).toBeCalledWith(ROUTES.PROFILE);
  });
});

import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { wait } from '_utils/wait';
import CheckBalanceModal, { Props } from './CheckBalanceModal';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

describe('CheckBalanceModal', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      visible: true,
      loadGiftCardBalanceData: jest.fn(),
      onPressOutside: jest.fn(),
      checksAvailable: 3
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<CheckBalanceModal {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should close modal if the user taps on not now button ', async () => {
    const { getByTestId } = renderWithGlobalContext(<CheckBalanceModal {...props} />);
    await act(() => wait(0));
    fireEvent.press(getByTestId('check-balance-modal-not-now-button'));
    await act(() => wait(0));
    expect(props.onPressOutside).toBeCalled();
  });

  it('should run callback if the user taps on the yes button', async () => {
    const { getByTestId } = renderWithGlobalContext(<CheckBalanceModal {...props} />);
    await act(() => wait(0));
    fireEvent.press(getByTestId('check-balance-modal-yes-button'));
    await act(() => wait(0));
    expect(props.loadGiftCardBalanceData).toBeCalled();
  });

  it('if available check balance is 1 modal subtitle should not exist', async () => {
    props.checksAvailable = 1;
    const { queryByTestId } = renderWithGlobalContext(<CheckBalanceModal {...props} />);
    await act(() => wait(0));
    expect(queryByTestId('check-balance-modal-subtitle')).toBeFalsy();
  });

  it('subtitle should contain one if available check balance is 2', async () => {
    props.checksAvailable = 2;
    const { getByTestId } = renderWithGlobalContext(<CheckBalanceModal {...props} />);
    await act(() => wait(0));
    expect(getByTestId('check-balance-modal-subtitle').children[1]).toEqual('one chance');
  });

  it('subtitle should contain two if available check balance is 3', async () => {
    props.checksAvailable = 3;
    const { getByTestId } = renderWithGlobalContext(<CheckBalanceModal {...props} />);
    await act(() => wait(0));
    expect(getByTestId('check-balance-modal-subtitle').children[1]).toEqual('two chances');
  });
});

import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent, render } from '@testing-library/react-native';
import { BackButton, Props } from './BackButton';
import { wait } from '_utils/wait';

const mockedGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockedGoBack })
}));

describe('BackButton', () => {
  let props: Props;

  it('should render with default values', async () => {
    const { toJSON, getByTestId } = render(<BackButton />);
    expect(toJSON()).toMatchSnapshot();
    fireEvent.press(getByTestId('back-button-default'));
    await act(() => wait(0));
    expect(mockedGoBack).toBeCalled();
  });

  it('should get custom testId properly', async () => {
    props = {
      testIdName: 'custom'
    };
    const { getByTestId } = render(<BackButton {...props} />);
    fireEvent.press(getByTestId('back-button-custom'));
    await act(() => wait(0));
    expect(mockedGoBack).toBeCalled();
  });

  it('should fire event with custom onPress', async () => {
    props = {
      onPress: jest.fn()
    };
    const { getByTestId } = render(<BackButton {...props} />);
    fireEvent.press(getByTestId('back-button-default'));
    await act(() => wait(0));
    expect(props.onPress).toBeCalled();
  });
});

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import Input from './Input';

describe('Input', () => {
  it('it should render', () => {
    const { toJSON } = render(<Input />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('it should render invalid', () => {
    const { toJSON } = render(<Input isInvalid={true} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('it should render valid text pattern', () => {
    const { queryByTestId } = render(<Input isModeUpdate={true} value={'12345'} pattern={'\\d{5}'} typePattern={'Text'} errorText="invalid field" />);
    expect(queryByTestId('text-input-text')).toBeNull();
  });

  it('it should render valid date pattern', () => {
    const { queryByTestId } = render(<Input isModeUpdate={true} value={'12-03-2021'} pattern={'MM-DD-YYYY'} typePattern={'Date'} errorText="invalid field" />);
    expect(queryByTestId('text-input-text')).toBeNull();
  });

  it('it should render invalid date pattern', () => {
    const { getByTestId } = render(<Input isModeUpdate={true} value={'15-03-2021'} pattern={'MM-DD-YYYY'} typePattern={'Date'} errorText="invalid field" />);
    expect(getByTestId('text-input-text')).toBeTruthy();
  });

  it('it should show invalid field error', () => {
    const { getByTestId } = render(<Input isModeUpdate={true} value={'1234'} pattern={'\\d{5}'} typePattern={'Text'} errorText="invalid field" />);
    expect(getByTestId('text-input-text')).toBeTruthy();
  });

  it('it should render and active onChangeText event', () => {
    const onEventMock = jest.fn();
    const text = '12345';
    const { getByTestId } = render(<Input isModeUpdate={true} onChangeText={onEventMock} value={text} testID="input" />);
    fireEvent(getByTestId('input'), 'onChangeText', text);
    expect(onEventMock).toHaveBeenCalledWith(text);
  });
});

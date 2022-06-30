import React from 'react';

import DatePicker, { Props } from './DatePicker';
import { fireEvent, render } from '@testing-library/react-native';

describe('DatePicker', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      date: new Date(1980),
      onChangeDate: jest.fn()
    };
  });

  it('it should render', () => {
    const { toJSON } = render(<DatePicker {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('it should render invalid', () => {
    const { toJSON } = render(<DatePicker {...props} date={null} isInvalid={true} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('it should pick a date', () => {
    const date = new Date(1980);
    const { getByTestId } = render(<DatePicker {...props} date={null} isInvalid={true} testID="picker" />);
    fireEvent(getByTestId('date-picker-input'), 'onPressIn');
    fireEvent(getByTestId('picker'), 'onConfirm', date);
    expect(props.onChangeDate).toBeCalledWith(date);
  });
});

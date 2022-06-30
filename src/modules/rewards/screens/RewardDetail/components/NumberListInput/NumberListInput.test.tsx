import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import NumberListInput, { Props } from './NumberListInput';

describe('CategoryCard', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      value: '10',
      max: 30,
      optionList: [5, 10, 15, 20, 25, 30],
      onChange: jest.fn(),
      label: 'anything',
      errorLabel: 'anything with error',
      valid: true,
      onMoveScroll: jest.fn()
    };
  });

  it('should render', async () => {
    const { toJSON } = render(<NumberListInput {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render invalid', async () => {
    const { toJSON } = render(<NumberListInput {...props} valid={false} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without values', async () => {
    const { toJSON } = render(<NumberListInput {...props} value={'0'} optionList={[]} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with default props', async () => {
    const defaultProps = {
      value: '10',
      onChange: jest.fn(),
      onMoveScroll: jest.fn()
    };
    const { toJSON } = render(<NumberListInput {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should return the typed value', async () => {
    const { getByTestId, rerender, toJSON } = render(<NumberListInput {...props} freeSelection={true} />);
    fireEvent.changeText(getByTestId('gift-card-input-input'), '12');

    expect(props.onChange).toBeCalledWith('12');
    rerender(<NumberListInput {...props} freeSelection={true} value={'12'} />);
    expect(toJSON()).toMatchSnapshot(); // scrolls near 15
  });

  it('should NOT return an invalid number when the value entered is not a number', async () => {
    const { getByTestId } = render(<NumberListInput {...props} freeSelection={true} />);
    fireEvent.changeText(getByTestId('gift-card-input-input'), '.?..');
    expect(props.onChange).not.toBeCalled();
  });

  it('should return a decimal number with fixed decimals', async () => {
    const { getByTestId } = render(<NumberListInput {...props} freeSelection={true} />);
    fireEvent.changeText(getByTestId('gift-card-input-input'), '12.3456');
    expect(props.onChange).toBeCalledWith('12.34');
  });

  it('should return a decimal number only when the user finished typing a valid number', async () => {
    const { getByTestId } = render(<NumberListInput {...props} freeSelection={true} />);

    fireEvent.changeText(getByTestId('gift-card-input-input'), '1');
    fireEvent.changeText(getByTestId('gift-card-input-input'), '1.');
    fireEvent.changeText(getByTestId('gift-card-input-input'), '1.2');
    expect(props.onChange).toBeCalledWith('1');
    expect(props.onChange).toBeCalledWith('1.2');
    expect(props.onChange).toBeCalledTimes(2);
  });

  it('should not press an option value when the component is disabled', async () => {
    const { getAllByTestId } = render(<NumberListInput {...props} disabled={true} />);

    fireEvent.press(getAllByTestId('gift-card-input-option')[0]);
    expect(props.onChange).not.toBeCalled();
  });

  it('should have a selectable options list', async () => {
    const { getAllByTestId } = render(<NumberListInput {...props} />);
    fireEvent.press(getAllByTestId('gift-card-input-option')[0]);
    expect(props.onChange).toBeCalledWith(props.optionList[0].toString());
  });

  it('should change the border of the input when this is focus in/out', async () => {
    props.freeSelection = true;
    const { toJSON, getByTestId } = render(<NumberListInput {...props} />);

    fireEvent(getByTestId('gift-card-input-input'), 'focus');
    expect(toJSON()).toMatchSnapshot(); // border-bottom on blue and 3px
    fireEvent(getByTestId('gift-card-input-input'), 'blur');
    expect(toJSON()).toMatchSnapshot(); // border-bottom on gray and 1px
  });

  it('should not change the value when an option is pressed', async () => {
    props.max = 1;
    const { getAllByTestId } = render(<NumberListInput {...props} />);
    fireEvent.press(getAllByTestId('gift-card-input-option')[0]);
    expect(props.onChange).not.toBeCalledWith();
  });
});

import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { COLOR } from '_constants/styles';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import CheckInput, { Props } from './CheckInput';

describe('CheckInput', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      label: 'My check label',
      value: false,
      onChange: jest.fn()
    };
  });

  it('should render unchecked circle', () => {
    const { getByTestId } = renderWithGlobalContext(<CheckInput {...props} />);
    expect(getByTestId('check-input-label')).toHaveTextContent(props.label);
    expect(getByTestId('check-input-unchecked-icon')).toBeTruthy();
  });

  it('should render with checked styles', () => {
    props.value = true;
    const { getByTestId } = renderWithGlobalContext(<CheckInput {...props} />);
    expect(getByTestId('check-input-checked-icon')).toHaveStyle({ backgroundColor: COLOR.DARK_GREEN });
  });

  it('should render square icon unchecked circle', () => {
    props.squareShape = true;
    const { getByTestId } = renderWithGlobalContext(<CheckInput {...props} />);
    expect(getByTestId('check-input-label')).toHaveTextContent(props.label);
    expect(getByTestId('check-input-unchecked-icon')).toBeTruthy();
  });

  it('should render square icon with checked styles', () => {
    props.squareShape = true;
    props.value = true;
    const { getByTestId } = renderWithGlobalContext(<CheckInput {...props} />);
    expect(getByTestId('check-input-checked-icon')).toHaveStyle({ backgroundColor: COLOR.DARK_GREEN });
  });

  it('should called onChange toggling value if pressed', () => {
    props.value = true;
    const { getByTestId } = renderWithGlobalContext(<CheckInput {...props} />);
    fireEvent.press(getByTestId('check-input-container'));
    expect(props.onChange).toHaveBeenCalledWith(!props.value);
  });
});

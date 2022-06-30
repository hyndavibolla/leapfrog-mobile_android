import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import SearchInput, { Props } from './SearchInput';

describe('SearchInput', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      placeholder: 'Search Brands, Categories',
      value: '',
      onChange: jest.fn(),
      filtersActive: 0,
      onFilterPress: jest.fn(),
      disabled: false,
      onFocusChange: jest.fn(),
      hideFilters: false
    };
  });

  it('should render', () => {
    const { toJSON } = render(<SearchInput {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not render filter button when hideFilters is true', () => {
    props.hideFilters = true;
    const { queryByTestId } = render(<SearchInput {...props} />);
    expect(queryByTestId('search-input-filter-btn')).toBeNull();
  });

  it('should render active icon', () => {
    props.filtersActive = 2;
    const { toJSON, getByTestId } = render(<SearchInput {...props} />);
    expect(getByTestId('search-input-filter-btn')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call on change callback when the text input changed', () => {
    const text = 'text';
    const { getByTestId } = render(<SearchInput {...props} />);
    fireEvent.changeText(getByTestId('search-input-input'), text);
    expect(props.onChange).toBeCalledWith(text);
  });

  it('should not call onChange callback when the input is disabled', () => {
    props.disabled = true;
    const { getByTestId } = render(<SearchInput {...props} />);

    fireEvent.changeText(getByTestId('search-input-input'), 'text');

    expect(props.onChange).not.toBeCalled();
  });

  it('should not call onFilterPress callback when the input is disabled', () => {
    props.disabled = true;
    const { getByTestId } = render(<SearchInput {...props} />);

    fireEvent.press(getByTestId('search-input-filter-btn'));

    expect(props.onFilterPress).not.toBeCalled();
  });

  it('should call onFilterPress callback when the filter was pressed', () => {
    const { getByTestId } = render(<SearchInput {...props} />);
    fireEvent.press(getByTestId('search-input-filter-btn'));
    expect(props.onFilterPress).toBeCalled();
  });

  it('should call onFocusChange callback when the input was focused', () => {
    const { getByTestId } = render(<SearchInput {...props} />);
    fireEvent(getByTestId('search-input-input'), 'focus');
    expect(props.onFocusChange).toBeCalled();
  });
});

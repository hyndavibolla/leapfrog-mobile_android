import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import CategoryList, { Props } from './CategoryList';

import { getMissionCategory_1, getMissionCategory_2 } from '_test_utils/entities';

describe('CategoryList', () => {
  let props: Props;

  const mockOnToggle = jest.fn();
  const mockOnClearAll = jest.fn();
  const mockOnApply = jest.fn();

  beforeEach(() => {
    props = {
      categoryList: [getMissionCategory_1(), getMissionCategory_2()],
      selectedNameList: [],
      onToggle: mockOnToggle,
      onClearAll: mockOnClearAll,
      onApply: mockOnApply
    };
  });

  it('should render ', () => {
    const { toJSON } = render(<CategoryList {...props} selectedNameList={[getMissionCategory_1().name]} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not render any category card when the categoryList is empty', () => {
    props.categoryList = [];
    const { queryByTestId } = render(<CategoryList {...props} selectedNameList={[getMissionCategory_1().name]} />);
    expect(queryByTestId('category-card-container')).toBeNull();
  });

  it('should call onToggle callback when a card was pressed', () => {
    const { getAllByTestId } = render(<CategoryList {...props} />);
    fireEvent.press(getAllByTestId('category-card-container')[0]);
    expect(mockOnToggle).toBeCalledWith(getMissionCategory_1().name);
  });

  it('should call onClearAll callback when clear all was pressed', () => {
    const { getByTestId } = render(<CategoryList {...props} />);
    fireEvent.press(getByTestId('category-list-clear-all'));
    expect(mockOnClearAll).toBeCalled();
  });

  it('should call onApply callback when the apply button was pressed', () => {
    const { getByTestId } = render(<CategoryList {...props} />);
    fireEvent.press(getByTestId('category-list-apply'));
    expect(mockOnApply).toBeCalled();
  });
});

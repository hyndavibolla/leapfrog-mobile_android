import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

import SearchFilterItem, { Props } from './SearchFilterItem';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';

describe('SearchFilterItem', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      title: 'title',
      onPress: jest.fn(),
      isSelected: false,
      identifier: 'id'
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<SearchFilterItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with identifier', () => {
    const { getByTestId } = renderWithGlobalContext(<SearchFilterItem {...props} />);
    expect(getByTestId('filter-item-category-id-btn')).toBeTruthy();
  });

  it('should execute onPress', async () => {
    const { getByTestId } = renderWithGlobalContext(<SearchFilterItem {...props} />);
    fireEvent.press(getByTestId('filter-item-category-id-btn'));
    await act(() => wait(0));
    expect(props.onPress).toBeCalled();
  });
});

import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import RecentHistoryItem, { Props } from './RecentHistoryItem';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

describe('RecentHistoryItem', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      title: 'title',
      onPress: jest.fn(),
      category: false
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<RecentHistoryItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with identifier', () => {
    props.category = true;
    const { getByTestId } = renderWithGlobalContext(<RecentHistoryItem {...props} />);
    expect(getByTestId('recent-search-item')).toBeTruthy();
  });

  it('should execute onPress', async () => {
    const { getByTestId } = renderWithGlobalContext(<RecentHistoryItem {...props} />);
    fireEvent.press(getByTestId('recent-search-item'));
    expect(props.onPress).toBeCalled();
  });
});

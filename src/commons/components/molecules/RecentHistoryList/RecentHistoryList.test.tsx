import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import RecentHistoryList, { Props } from './RecentHistoryList';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { RecentSearchHistoryType, IRecentSearchHistory } from '_models/searchHistory';

describe('RecentHistoryList', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      onPress: jest.fn(),
      historyList: []
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<RecentHistoryList {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with identifier', () => {
    const { queryByTestId } = renderWithGlobalContext(<RecentHistoryList {...props} />);
    expect(queryByTestId('recent-search-list')).toBeFalsy();
  });

  it('should execute onPress', async () => {
    const item: IRecentSearchHistory = { id: 'id', name: 'name', type: RecentSearchHistoryType.MISSION };
    props.historyList = [item];
    const { getByTestId } = renderWithGlobalContext(<RecentHistoryList {...props} />);
    fireEvent.press(getByTestId('recent-search-item'));
    expect(props.onPress).toBeCalled();
  });
});

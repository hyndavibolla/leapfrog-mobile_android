import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { getMissionCategory_1, getMissionCategory_2 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';
import TopCategories, { Props } from './TopCategories';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: mockNavigate })
}));

describe('TopCategories', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      data: [getMissionCategory_1(), getMissionCategory_2()]
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<TopCategories {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not render if props data is empty', async () => {
    props.data = [];
    const { queryByTestId } = renderWithGlobalContext(<TopCategories {...props} />);
    await act(() => wait(0));
    expect(queryByTestId('earn-main-top-categories-container')).toBeFalsy();
  });

  it('should navigate to mission list when a any category card was pressed', async () => {
    props.data = [getMissionCategory_1()];
    const { getAllByTestId } = renderWithGlobalContext(<TopCategories {...props} />);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('medium-category-card-container')[0]);
    expect(mockNavigate).toBeCalledWith(expect.any(String), expect.any(Object));
  });
});

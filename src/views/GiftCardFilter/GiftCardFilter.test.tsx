import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

import GiftCardFilter, { Props } from './GiftCardFilter';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getRewardConfig_1, getSlideCategoryIdList } from '_test_utils/entities';
import { wait } from '_utils/wait';
import { getInitialState } from '_state_mgmt/GlobalState';
import { IGlobalState } from '_models/general';
import { ROUTES } from '_constants/routes';

describe('GiftCardFilter', () => {
  let props: Props;
  let stateWithCategories: any;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    stateWithCategories = { ...initialState, reward: { ...initialState.reward, config: getRewardConfig_1(), slideCategoryIdList: getSlideCategoryIdList() } };
    props = {
      navigation: { navigate: jest.fn(), replace: jest.fn() } as any,
      route: {
        params: {
          categories: getSlideCategoryIdList()
        }
      }
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<GiftCardFilter {...props} />, undefined, stateWithCategories);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should NOT render category items', async () => {
    const [, category_1] = getRewardConfig_1().categories.map(c => c.id);
    const { queryByTestId } = renderWithGlobalContext(<GiftCardFilter {...props} />, undefined, stateWithCategories);
    expect(queryByTestId(`filter-item-category-${category_1}-btn`)).toBeTruthy();
  });

  it('should render category list', async () => {
    const [, category_1] = getRewardConfig_1().categories.map(c => c.id);
    const { queryByTestId } = renderWithGlobalContext(<GiftCardFilter {...props} />);
    expect(queryByTestId(`filter-item-category-${category_1}-btn`)).toBeTruthy();
  });

  it('should navigate to search list with filters', async () => {
    const [, category_1] = getRewardConfig_1().categories.map(c => c.id);
    initialState.core.routeHistory = [ROUTES.FILTER, ROUTES.MAIN_TAB.REWARDS];
    const { getByTestId } = renderWithGlobalContext(<GiftCardFilter {...props} />, undefined, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId(`filter-item-category-${category_1}-btn`));
    await act(() => wait(0));
    fireEvent.press(getByTestId('filter-apply'));
    await act(() => wait(0));
    expect(props.navigation.replace).toBeCalledWith(ROUTES.REWARDS_LIST_BY_CATEGORY, { searchCategoryIdList: [category_1] });
  });

  it('should navigate to search list without filters', async () => {
    const [, category_1] = getRewardConfig_1().categories.map(c => c.id);
    initialState.core.routeHistory = [ROUTES.FILTER, ROUTES.REWARDS_LIST_BY_CATEGORY];
    const { getByTestId } = renderWithGlobalContext(<GiftCardFilter {...props} />, undefined, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId(`filter-item-category-${category_1}-btn`));
    await act(() => wait(0));
    fireEvent.press(getByTestId('filter-clear'));
    await act(() => wait(0));
    fireEvent.press(getByTestId('filter-apply'));
    await act(() => wait(0));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.REWARDS_LIST_BY_CATEGORY, { searchCategoryIdList: [] });
  });

  it('should navigate to search list without filters when unselect a category', async () => {
    const [, category_1] = getRewardConfig_1().categories.map(c => c.id);
    initialState.core.routeHistory = [ROUTES.FILTER, ROUTES.REWARDS_LIST_BY_CATEGORY];
    const { getByTestId } = renderWithGlobalContext(<GiftCardFilter {...props} />, undefined, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId(`filter-item-category-${category_1}-btn`));
    await act(() => wait(0));
    fireEvent.press(getByTestId(`filter-item-category-${category_1}-btn`));
    await act(() => wait(0));
    fireEvent.press(getByTestId('filter-apply'));
    await act(() => wait(0));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.REWARDS_LIST_BY_CATEGORY, { searchCategoryIdList: [] });
  });
});

import React from 'react';
import navigation from '@react-navigation/native';
import { fireEvent, waitFor } from '@testing-library/react-native';

import GiftCardList, { Props } from './GiftCardList';

import { KnownSlideObjectSearchKey } from '_state_mgmt/reward/state';
import { getInitialState } from '_state_mgmt/GlobalState';
import { RewardModel } from '_models';
import { Deps, IGlobalState } from '_models/general';
import { IRecentSearchHistory, RecentSearchHistoryType } from '_models/searchHistory';

import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getRewardConfig_1, getSlideBrand_1, getSlideBrand_2, getSlideBrand_3, getSlideCategoryIdList } from '_test_utils/entities';
import { listToMap } from '_utils/listToMap';
import { ROUTES } from '_constants/routes';

jest.mock('@react-navigation/native', () => {
  return { useNavigation: () => ({ navigate: jest.fn() }) };
});

describe('GiftCardList', () => {
  let props: Props;
  let deps: Deps;
  let initState: IGlobalState;

  beforeEach(() => {
    navigation.useIsFocused = jest.fn(() => true);
    initState = getInitialState();
    props = {
      navigation: {
        setParams: jest.fn(),
        isFocused: jest.fn(() => false),
        navigate: jest.fn(),
        setOptions: jest.fn().mockImplementation(({ header }) => header())
      } as any,
      route: { params: { searchKey: KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS } }
    };
    deps = getMockDeps();

    initState.reward.config = getRewardConfig_1();
    initState.reward.slideObjectSearchMap[KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS] = [
      getSlideBrand_1().id,
      getSlideBrand_2().id,
      getSlideBrand_3().id
    ];
    initState.reward.slideObjectMapByType[RewardModel.SlideObjectType.BRAND] = listToMap([getSlideBrand_1(), getSlideBrand_2(), getSlideBrand_3()]);
    initState.reward.slideCategoryIdList = getSlideCategoryIdList();
  });

  it('should render with incomplete data', async () => {
    initState.reward.slideObjectSearchMap[KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS] = null;
    const { toJSON } = renderWithGlobalContext(<GiftCardList {...props} />, deps, initState);
    await waitFor(() => expect(toJSON()).toMatchSnapshot());
  });

  it('should render with data', async () => {
    props.route.params = null;
    initState.reward.slideObjectSearchMap[KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS] = [
      getSlideBrand_1().id,
      getSlideBrand_2().id,
      getSlideBrand_3().id,
      null
    ];

    const { toJSON } = renderWithGlobalContext(<GiftCardList {...props} />, deps, initState);
    await waitFor(() => expect(toJSON()).toMatchSnapshot());
  });

  it('should have a scroll to top button', async () => {
    const { queryByTestId, getByTestId } = renderWithGlobalContext(<GiftCardList {...props} />, deps, initState);

    await waitFor(() => {
      expect(queryByTestId('gift-card-list-scroll-btn')).toBeNull();
    });

    fireEvent.scroll(getByTestId('gift-card-list-scroll'), {
      nativeEvent: {
        contentOffset: {
          y: 500
        },
        contentSize: {
          height: 500,
          width: 100
        },
        layoutMeasurement: {
          height: 100,
          width: 100
        }
      }
    });

    expect(getByTestId('gift-card-list-scroll-btn')).toBeTruthy();
    fireEvent.press(getByTestId('gift-card-list-scroll-btn'));
    expect(getByTestId('gift-card-list-scroll-btn')).toBeTruthy();
  });

  it('should navigate to details when a card is pressed', async () => {
    const { getAllByTestId } = renderWithGlobalContext(<GiftCardList {...props} />, deps, initState);

    await waitFor(() => {
      expect(getAllByTestId('small-gift-card-container')).toBeTruthy();
    });

    fireEvent.press(getAllByTestId('small-gift-card-container')[0]);

    expect(props.navigation.navigate).toBeCalledWith(ROUTES.GIFT_CARD_DETAIL, {
      brandId: getSlideBrand_1().id
    });
  });

  it('should show the searched text', async () => {
    props.route.params.searchText = 'text';

    const { findByTestId } = renderWithGlobalContext(<GiftCardList {...props} />, deps, initState);
    expect(await findByTestId('gift-card-list-searched-text')).toBeTruthy();
  });

  it('should press a history item and call set params', async () => {
    const item: IRecentSearchHistory = {
      id: 'id',
      name: 'name',
      type: RecentSearchHistoryType.CATEGORY
    };
    props.navigation.isFocused = jest.fn(() => true);
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce([item]);

    const { findByTestId } = renderWithGlobalContext(<GiftCardList {...props} />, deps, initState);

    fireEvent.press(await findByTestId('recent-search-item'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.REWARDS_LIST_BY_CATEGORY, {
      searchCategoryIdList: ['id'],
      searchKey: KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS
    });
  });

  it('should press a history item and without call set params', async () => {
    const item: IRecentSearchHistory = {
      id: 'id',
      name: 'name',
      type: RecentSearchHistoryType.REWARD
    };
    props.navigation.isFocused = jest.fn(() => true);
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce([item]);

    const { findByTestId } = renderWithGlobalContext(<GiftCardList {...props} />, deps, initState);

    fireEvent.press(await findByTestId('recent-search-item'));
    expect(props.navigation.setParams).not.toBeCalled();
  });

  it('should NOT render history items', async () => {
    props.navigation.isFocused = jest.fn(() => true);
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce(null);

    const { queryByTestId } = renderWithGlobalContext(<GiftCardList {...props} />, deps, initState);

    await waitFor(() => {
      expect(queryByTestId('recent-search-item')).toBeNull();
    });
  });
});

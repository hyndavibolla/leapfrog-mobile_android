import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import GiftCardListByCategory, { Props } from './GiftCardListByCategory';

import { KnownSlideObjectSearchKey } from '_state_mgmt/reward/state';
import { getInitialState } from '_state_mgmt/GlobalState';
import { RewardModel } from '_models';
import { Deps, IGlobalState } from '_models/general';

import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getRewardConfig_1, getSlideBrand_1, getSlideBrand_2, getSlideBrand_3, getSlideCategoryIdList } from '_test_utils/entities';
import { listToMap } from '_utils/listToMap';
import { ROUTES } from '_constants/routes';

describe('GiftCardListByCategory', () => {
  let props: Props;
  let deps: Deps;
  let initState: IGlobalState;

  beforeEach(() => {
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

    const { toJSON } = renderWithGlobalContext(<GiftCardListByCategory {...props} />, deps, initState);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with data', async () => {
    props.route.params = null;
    initState.reward.slideObjectSearchMap[KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS] = [
      getSlideBrand_1().id,
      getSlideBrand_2().id,
      getSlideBrand_3().id,
      null
    ];

    const { toJSON } = renderWithGlobalContext(<GiftCardListByCategory {...props} />, deps, initState);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should have a scroll to top button', async () => {
    const { queryByTestId, getByTestId } = renderWithGlobalContext(<GiftCardListByCategory {...props} />, deps, initState);
    expect(queryByTestId('gift-card-list-category-scroll-btn')).toBeNull();

    fireEvent.scroll(getByTestId('gift-card-list-category-scroll'), {
      nativeEvent: {
        contentOffset: { y: 500 },
        contentSize: { height: 500, width: 100 },
        layoutMeasurement: { height: 100, width: 100 }
      }
    });

    expect(getByTestId('gift-card-list-category-scroll-btn')).toBeTruthy();
    fireEvent.press(getByTestId('gift-card-list-category-scroll-btn'));
  });

  it('should filter', async () => {
    props.route.params.searchCategoryIdList = [getSlideCategoryIdList()[0]];

    const { findAllByTestId } = renderWithGlobalContext(<GiftCardListByCategory {...props} />, deps, initState);
    expect(await findAllByTestId('small-gift-card-container')).toHaveLength(3);
  });

  it('should navigate to details when a card is pressed', async () => {
    const { getAllByTestId } = renderWithGlobalContext(<GiftCardListByCategory {...props} />, deps, initState);

    fireEvent.press(getAllByTestId('small-gift-card-container')[0]);
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.GIFT_CARD_DETAIL, { brandId: getSlideBrand_1().id });
  });

  it('should show the searched text', async () => {
    props.route.params.searchText = 'text';

    const { findByTestId } = renderWithGlobalContext(<GiftCardListByCategory {...props} />, deps, initState);
    expect(findByTestId('gift-card-list-category-searched-text')).toBeTruthy();
  });
});

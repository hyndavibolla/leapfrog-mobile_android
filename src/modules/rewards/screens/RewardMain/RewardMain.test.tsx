import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTES } from '_constants';
import { Deps, IGlobalState, TooltipKey } from '_models/general';
import { getGiftCard } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getRewardConfig_1, getEmptyRewardConfig, getSlideBrand_1, getSlideBrand_4, getSlideObject_3, getRewardConfig_3 } from '_test_utils/entities';
import { getInitialState } from '_state_mgmt/GlobalState';
import { KnownSlideObjectSearchKey } from '_state_mgmt/reward/state';
import { getStateSnapshotStorage } from '_utils/getStateSnapshotStorage';
import RewardMain, { Props, REDEEM_URL } from './RewardMain';

describe('RewardMain', () => {
  let props: Props;
  let deps: Deps;
  let render;
  let initState: IGlobalState;

  beforeEach(() => {
    props = {
      navigation: { navigate: jest.fn(), setParams: jest.fn() } as any
    };

    initState = getInitialState();
    deps = getMockDeps();
    deps.stateSnapshot = getStateSnapshotStorage();

    const { Screen, Navigator } = createStackNavigator();
    render = (p, d, s) => {
      const Component = () => <RewardMain {...props} {...(p || {})} />;
      return renderWithGlobalContext(
        <NavigationContainer>
          <Navigator>
            <Screen name="route" component={Component} />
          </Navigator>
        </NavigationContainer>,
        d,
        s
      );
    };
  });

  it('should render loading', async () => {
    const { findByTestId } = render(props, deps, initState);
    expect(await findByTestId('reward-main-skeleton-container')).toBeTruthy();
  });

  it('should render with a critical error', async () => {
    (deps.apiService.fetchRewardConfig as any) = jest.fn().mockResolvedValueOnce('error');
    const { findByTestId } = render(props, deps, initState);

    expect(await findByTestId('critical-error-container')).toBeTruthy();
  });

  it('should navigate when pressing on tooltip', async () => {
    const { findByTestId } = render(props, deps, initState);
    fireEvent.press(await findByTestId('tooltip-button-button'));

    expect(props.navigation.navigate).toBeCalledWith(ROUTES.TOOLTIP.REWARDS);
  });

  it('should not re fetch the dismissed tooltip list when tooltip for the section is already dismissed', async () => {
    initState.core.dismissedTooltipList = [TooltipKey.REWARDS];

    render(props, deps, initState);
    await waitFor(() => {
      expect(deps.logger.debug).not.toBeCalledWith('getDismissedTooltipList');
    });
  });

  it('should NOT render a dismissed tooltip', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce([TooltipKey.REWARDS]);

    const { queryByTestId } = render(props, deps, initState);
    await waitFor(() => {
      expect(queryByTestId('gift-card-group-list-header-container')).toBeNull();
    });
  });

  it('should navigate to detail when a any card is pressed', async () => {
    const { findAllByTestId } = render(props, deps, initState);
    fireEvent.press((await findAllByTestId('brand-category-item-fallback-card'))[0]);

    expect(props.navigation.navigate).toBeCalledWith(ROUTES.GIFT_CARD_DETAIL, { brandId: getSlideBrand_1().id });
  });

  it('should navigate to detail when a card with faceplate', async () => {
    (deps.apiService.fetchRewardConfig as any) = jest.fn().mockResolvedValueOnce(getRewardConfig_3());
    deps.raiseService.fetchSlideBrand = jest.fn().mockResolvedValue([getSlideObject_3()]);
    const { findAllByTestId } = render(props, deps);
    fireEvent.press((await findAllByTestId('medium-category-card-container'))[0]);
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.GIFT_CARD_DETAIL, { brandId: getSlideBrand_4().id });
  });

  it('should navigate from the see all button', async () => {
    const { findAllByTestId } = render(props, deps, initState);
    fireEvent.press((await findAllByTestId('category-brand-see-all-btn'))[0]);

    expect(props.navigation.navigate).toBeCalledWith(ROUTES.REWARDS_LIST_BY_CATEGORY, {
      searchCategoryIdList: [getRewardConfig_1().categories[4].id],
      searchKey: KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS
    });
  });

  it('should not render the header', async () => {
    (deps.apiService.fetchRewardConfig as any) = jest.fn().mockResolvedValueOnce(getEmptyRewardConfig());

    const { queryByTestId } = render(props, deps, initState);

    await waitFor(() => {
      expect(queryByTestId('gift-card-group-list-header-container')).toBeNull();
    });
  });

  it('should open a redeem Url', async () => {
    (deps.apiService.fetchRewardConfig as any) = jest.fn().mockResolvedValueOnce(getEmptyRewardConfig());
    const { findByTestId } = render(props, deps, initState);
    fireEvent.press(await findByTestId('reward-card-container'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.COMMON_WEB_VIEW.MAIN, {
      showTitle: false,
      url: REDEEM_URL
    });
  });

  it('should render gift cards banner if user have active gift cards', async () => {
    deps.apiService.fetchGiftCardList = jest.fn().mockResolvedValueOnce({ giftCards: [getGiftCard()] });
    const { findByTestId } = render(props, deps, initState);
    expect(await findByTestId('card-with-logos-pressable-container')).toBeTruthy();
  });

  it('should not render gift cards banner if user does not have active gift cards', async () => {
    deps.apiService.fetchGiftCardList = jest.fn().mockResolvedValueOnce({ giftCards: [] });
    const { queryByTestId } = render(props, deps, initState);
    await waitFor(() => expect(queryByTestId('card-with-logos-pressable-container')).toBeNull());
  });

  it('should search by text', async () => {
    const text = 'text';

    const { findByTestId } = render(props, deps, initState);

    const element = await findByTestId('search-input-input');
    fireEvent.changeText(element, text);
    fireEvent(element, 'submitEditing');

    expect(props.navigation.navigate).toBeCalledWith(ROUTES.GIFT_CARD_SEE_ALL, {
      title: 'Search Results',
      searchKey: KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS,
      searchText: text,
      searchCategoryIdList: []
    });
  });

  it('should navigate to filter', async () => {
    initState.reward.config = getRewardConfig_1();

    const { findByTestId } = render(props, deps, initState);
    fireEvent.press(await findByTestId('search-input-filter-btn'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.FILTER, expect.any(Object));
  });

  it('should navigate when focusing on the input', async () => {
    const { findByTestId } = render(props, deps, initState);

    fireEvent(await findByTestId('search-input-input'), 'focus');

    expect(props.navigation.navigate).toHaveBeenCalledWith(expect.any(String), {
      title: 'Search Results',
      searchKey: KnownSlideObjectSearchKey.FULL_BRAND_SEARCH_RESULTS,
      searchText: '',
      searchCategoryIdList: [],
      autoFocus: true
    });
  });
});

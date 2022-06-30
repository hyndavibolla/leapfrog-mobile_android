import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { ENV, GROCERY_AND_DELIVERY_CATEGORY, ROUTES } from '_constants';
import { GeneralModel } from '_models';
import { Deps, FeatureFlag, TooltipKey } from '_models/general';
import { MissionListType } from '_models/mission';
import { getActivity_1, getActivity_2, getActivity_3, getActivity_4, getActivity_5, getStreak_1 } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getInitialState } from '_state_mgmt/GlobalState';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';

import StreakMain, { Props } from './StreakMain';

describe('StreakMain', () => {
  let state: GeneralModel.IGlobalState;
  let deps: Deps;
  let props: Props;
  let render;

  beforeEach(() => {
    Date.now = () => 1980;
    state = getInitialState();
    deps = getMockDeps();
    props = {
      navigation: { navigate: jest.fn(), isFocused: jest.fn(() => true), setOptions: jest.fn().mockImplementation(({ header }) => header()) } as any
    };
    const { Screen, Navigator } = createStackNavigator();
    render = (p, d, s) => {
      const Component = () => <StreakMain {...props} {...(p || {})} />;
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
    const { findByTestId } = render(<StreakMain {...props} />, deps, state);
    expect(await findByTestId('streak-main-skeleton-container')).toBeTruthy();
  });

  it('should render with streaks error', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockRejectedValue(new Error('streaks error'));
    const { findByTestId } = render(<StreakMain {...props} />, deps, state);
    expect(await findByTestId('streak-main-streaks-error')).toBeTruthy();
  });

  it('should render without brands', async () => {
    deps.apiService.fetchMissionList = jest.fn().mockRejectedValue(new Error('mission error'));
    const { findByTestId } = render(<StreakMain {...props} />, deps, state);
    expect(await findByTestId('streak-main-missions-error')).toBeTruthy();
  });

  it('should render after horizontal scrolling', async () => {
    const { getAllByTestId } = render(props, deps);
    await waitFor(() => {
      fireEvent(getAllByTestId('streak-main-horizontal-scroll')[0], 'onScroll', {
        nativeEvent: { contentOffset: { x: 80 }, contentSize: { width: 500 }, layoutMeasurement: { width: 500 } }
      });
      fireEvent(getAllByTestId('streak-main-horizontal-scroll')[0], 'momentumScrollEnd');
    });
  });

  it('should navigate to grocery & delivery category missions', async () => {
    const { findByTestId } = render(props, deps);
    fireEvent.press(await findByTestId('streak-main-missions-grocery-and-delivery'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.MISSION_SEE_ALL, {
      searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      missionListType: MissionListType.DEFAULT,
      initialSearchCriteria: { categoryNameList: [GROCERY_AND_DELIVERY_CATEGORY] }
    });
  });

  it('should navigate to mission detail', async () => {
    state.mission = { ...state.mission, isButtonInit: true, buttonUserId: '1234' };
    const { findAllByTestId } = render(props, deps, state);
    const missionList = await findAllByTestId('medium-mission-card-container');
    fireEvent.press(missionList[0]);
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.MISSION_DETAIL, expect.any(Object));
  });

  it('should navigate when pressing on tooltip', async () => {
    const { findByTestId } = render(props, deps);
    fireEvent.press(await findByTestId('tooltip-button-button'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.TOOLTIP.MISSIONS);
  });

  it('should not render confirmed purchases if there is not a streak available', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockResolvedValue([]);
    const { queryByTestId } = render(<StreakMain {...props} />, deps, state);
    await waitFor(() => {
      expect(queryByTestId('confirmed-purchase-card-container')).toBeNull();
    });
  });

  it('should render a message error if the fetch to streak activities fail', async () => {
    deps.apiService.fetchActivityHistory = jest.fn().mockRejectedValue(new Error('streaks error'));
    const { findByTestId } = render(<StreakMain {...props} />, deps, state);
    expect(await findByTestId('streak-main-activities-error')).toBeTruthy();
  });

  it('should not render more activities than the threshold value', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockResolvedValue([{ ...getStreak_1(), currentQualifiedValue: 4, thresholdValue: 3 }]);
    deps.apiService.fetchActivityHistory = jest
      .fn()
      .mockResolvedValue([getActivity_1(), getActivity_2(), getActivity_3(), { ...getActivity_4(), timestamp: '2019-12-01T12:00:00.000Z' }, getActivity_5()]);
    const { getAllByTestId } = render(<StreakMain {...props} />, deps, state);

    await waitFor(() => {
      expect(getAllByTestId('confirmed-purchase-card-container')).toHaveLength(3);
    });
  });

  it('should render missions even if streak is completed.', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockResolvedValue([{ ...getStreak_1(), currentQualifiedValue: 3, thresholdValue: 3 }]);
    const { findByTestId } = render(<StreakMain {...props} />, deps, state);
    expect(await findByTestId('streak-main-missions')).toBeTruthy();
  });

  it('should not render missions when streak has expired.', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockResolvedValue([{ ...getStreak_1(), endDt: Date.now() }]);
    const { queryByTestId } = render(<StreakMain {...props} />, deps, state);
    await waitFor(() => {
      expect(queryByTestId('streak-main-missions')).toBeNull();
    });
  });

  it('should navigate to wallet when the user press the cc', async () => {
    state.game.current.memberships.userHasSywCard = true;
    const { findByTestId } = render(<StreakMain {...props} />, deps, state);
    fireEvent.press(await findByTestId('credit-card-card-container'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.MAIN_TAB.WALLET);
  });

  it('should navigate to balance detail when go-to-purchases button is pressed', async () => {
    const { findByTestId } = render(<StreakMain {...props} />, deps);
    fireEvent.press(await findByTestId('streak-main-go-to-purchases-btn'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.POINT_HISTORY);
  });

  it('should not re fetch the dismissed tooltip list when tooltip for the section is already dismissed', async () => {
    const updatedState = {
      ...state,
      core: { ...state.core, dismissedTooltipList: [TooltipKey.MISSIONS] }
    };
    render(props, deps, updatedState);
    await waitFor(() => {
      expect(deps.logger.debug).not.toBeCalledWith('getDismissedTooltipList');
    });
  });

  it('should NOT render a dismissed tooltip', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue([TooltipKey.MISSIONS]);
    const { queryByTestId } = render(props, deps);
    await waitFor(() => {
      expect(queryByTestId('gift-card-list-header-container')).toBeNull();
    });
  });

  it('should navigate to search results when a search is focused', async () => {
    ENV.IGNORED_FEATURE_LIST.splice(ENV.IGNORED_FEATURE_LIST.indexOf(FeatureFlag.MISSIONS_SEARCH), 1);
    const { getByTestId, findByTestId } = render(<StreakMain {...props} />, deps);
    fireEvent.changeText(await findByTestId('search-input-input'), 'something');
    fireEvent(getByTestId('search-input-input'), 'onFocus');
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.MISSION_SEE_ALL, {
      searchKey: KnownMissionSearchKey.SEE_ALL,
      missionListType: MissionListType.DYNAMIC_LIST_2,
      title: state.mission.missionListTitleMap[KnownMissionSearchKey.DYNAMIC_LIST_2]
    });
  });
});

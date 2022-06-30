import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import MissionList, { Props } from './MissionList';
import { useLocationPermission } from '_utils/useLocationPermission';

import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { ACTION_TYPE } from '_state_mgmt/mission/actions';
import { getInitialState } from '_state_mgmt/GlobalState';

import { Deps, IGlobalState } from '_models/general';
import { MissionListType } from '_models/mission';

import { renderWrappedHook } from '_test_utils/renderWrappedHook';
import { getMockDeps } from '_test_utils/getMockDeps';
import {
  getMission_1,
  getMissionCategory_1,
  getMission_2,
  getMission_3,
  getMission_4,
  getStorageRecentSearchHistory,
  getStorageRecentSearchHistory_2,
  getMissionCategory_3
} from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import { listToMap } from '_utils/listToMap';
import { wait } from '_utils/wait';
import { ENV, GROCERY_AND_DELIVERY_CATEGORY, ROUTES } from '_constants';

const {
  RESULTS: { DENIED, GRANTED }
} = require('react-native-permissions/mock');
describe('MissionList', () => {
  let deps: Deps;
  let props: Props;
  let mockReducer: any;
  let stateWithData: IGlobalState;
  let render;
  let initialState: IGlobalState;
  beforeEach(() => {
    console.error = console.warn = () => null;
    initialState = getInitialState();
    deps = getMockDeps();
    props = {
      route: {
        params: {
          searchKey: KnownMissionSearchKey.SEE_ALL,
          initialSearchCriteria: undefined,
          missionListType: MissionListType.DEFAULT,
          title: 'Top Brands',
          isMainSearchFromEarnPage: true
        }
      },
      navigation: {
        navigate: jest.fn(),
        push: jest.fn(),
        pop: jest.fn(),
        setOptions: jest.fn().mockImplementation(({ header }) => header()),
        isFocused: jest.fn(() => false)
      } as any
    };
    mockReducer = jest.fn().mockReturnValue(initialState);
    stateWithData = {
      ...initialState,
      mission: {
        ...initialState.mission,
        buttonUserId: '1234',
        isButtonInit: true,
        missionMap: listToMap([getMission_1(), getMission_2(), getMission_3()], {}, 'uuid'),
        missionSearchMap: {
          ...initialState.mission.missionSearchMap,
          [KnownMissionSearchKey.SEE_ALL]: [getMission_1().uuid, getMission_2().uuid, getMission_3().uuid]
        }
      }
    };
    const { Screen, Navigator } = createStackNavigator();
    render = (p, d, s, c) => {
      const Component = () => <MissionList {...props} {...(p || {})} />;
      return renderWithGlobalContext(
        <NavigationContainer>
          <Navigator>
            <Screen name="route" component={Component} />
          </Navigator>
        </NavigationContainer>,
        d,
        s,
        c
      );
    };
  });

  it('should render', async () => {
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { toJSON } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render loading', async () => {
    props.route.params = {
      searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      initialSearchCriteria: { categoryNameList: [getMissionCategory_1().name], search: 'Search' },
      missionListType: MissionListType.DYNAMIC_LIST_2
    };
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { queryByTestId } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    expect(queryByTestId('mission-list-skeleton-container')).toBeTruthy();
    await act(() => wait(0));
  });

  it('should render with a points per cent value from API', async () => {
    stateWithData.game.current.missions.pointsPerCent = 10;
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { toJSON } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render and configure offers', async () => {
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { toJSON } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render as a search result list', async () => {
    props.route.params = {
      searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      initialSearchCriteria: { categoryNameList: [getMissionCategory_1().name], search: 'Search' },
      missionListType: MissionListType.DYNAMIC_LIST_2
    };
    stateWithData.mission.categoryList = [getMissionCategory_1()];
    stateWithData.mission.missionMap = listToMap([getMission_1(), getMission_2(), getMission_3(), getMission_4()], {}, 'uuid');
    stateWithData.mission.missionSearchMap[KnownMissionSearchKey.GENERAL_SEARCH_RESULTS] = [
      getMission_1().uuid,
      getMission_2().uuid,
      getMission_3().uuid,
      getMission_4().uuid
    ];
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { toJSON } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a result list with categories, offers that match name and other offers', async () => {
    props.route.params = {
      searchKey: KnownMissionSearchKey.DEFAULT,
      initialSearchCriteria: { categoryNameList: [], search: 'Apparel' },
      missionListType: MissionListType.DEFAULT
    };
    stateWithData.mission.categoryList = [getMissionCategory_1()];
    stateWithData.mission.missionMap = listToMap([getMission_1(), getMission_2(), getMission_3(), getMission_4()], {}, 'uuid');
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { toJSON } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render an empty state', async () => {
    props.route.params.searchKey = 'surprise!';
    stateWithData.mission.missionSearchMap[KnownMissionSearchKey.TRENDING] = [];
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { queryByTestId } = render(<MissionList {...props} />, undefined, stateWithData, mockReducer);
    await act(() => wait(0));
    expect(queryByTestId('mission-list-empty')).toBeTruthy();
  });

  it('should render a fallback', async () => {
    props.route.params = {
      searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      initialSearchCriteria: { categoryNameList: [getMissionCategory_1().name], search: 'Search' },
      missionListType: MissionListType.DYNAMIC_LIST_2
    };
    deps.apiService.fetchMissionList = jest.fn().mockImplementation(() => {
      throw new Error();
    });
    const { queryByTestId } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    expect(queryByTestId('mission-list-fallback')).toBeTruthy();
  });

  it('should search when it mounts', async () => {
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    props.route.params.initialSearchCriteria = { search: 'keyword', categoryNameList: [] };
    props.route.params.searchKey = KnownMissionSearchKey.GENERAL_SEARCH_RESULTS;
    render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    expect(mockReducer).toBeCalledWith(expect.any(Object), expect.objectContaining({ type: ACTION_TYPE.FLUSH_SEARCH_LIST }));
    expect(deps.logger.debug).toBeCalledWith('useMissionFreeSearch', {
      key: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      listType: expect.any(String),
      category: undefined,
      brandName: undefined,
      limit: ENV.MISSION_LIMIT.FULL,
      offset: undefined,
      keyword: 'keyword'
    });
    expect(deps.logger.debug).toBeCalledWith('useSearchHistory', 'setSearchHistory', 'keyword');
  });

  it('should navigate to local offer view when banner is pressed', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(GRANTED);
    renderWrappedHook(() => useLocationPermission(), deps);
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { findByTestId } = render(<MissionList {...props} />, undefined, stateWithData, mockReducer);
    fireEvent(await findByTestId('local-offer-banner-container'), 'onPress');
    await act(() => wait(0));
    expect(props.navigation.push).toBeCalledWith(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP);
  });

  it('should navigate to main view when banner is pressed', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(DENIED);
    renderWrappedHook(() => useLocationPermission(), deps);
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { findByTestId } = render(<MissionList {...props} />, undefined, stateWithData, mockReducer);
    fireEvent(await findByTestId('local-offer-banner-container'), 'onPress');
    await act(() => wait(0));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.MAIN_TAB.EARN, { scrollToSection: 'mapCardSection' });
  });

  it('should have a scroll to top button', async () => {
    props.route.params = {
      searchKey: KnownMissionSearchKey.SEE_ALL,
      initialSearchCriteria: { categoryNameList: [getMissionCategory_1().name], search: 'Search' },
      missionListType: MissionListType.DYNAMIC_LIST_2
    };
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { queryByTestId, findByTestId } = render(<MissionList {...props} />, undefined, stateWithData, mockReducer);
    await act(() => wait(0));
    const eventData = {
      nativeEvent: {
        contentOffset: { y: 500 },
        contentSize: { height: 500, width: 100 }, // Dimensions of the scrollable content
        layoutMeasurement: { height: 100, width: 100 } // Dimensions of the device
      }
    };
    expect(queryByTestId('mission-list-scroll-btn')).toBe(null);
    fireEvent.scroll(await findByTestId('mission-list-scroll'), eventData);
    expect(queryByTestId('mission-list-scroll-btn')).not.toBe(null);
    fireEvent.press(await findByTestId('mission-list-scroll-btn'));
  });

  it('should navigate to mission detail when a mission card was pressed', async () => {
    props.route.params = {
      searchKey: KnownMissionSearchKey.SEE_ALL,
      missionListType: MissionListType.DEFAULT,
      initialSearchCriteria: { categoryNameList: [getMissionCategory_1().name], search: 'Search' },
      isMainSearchFromEarnPage: true
    };
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    deps.nativeHelperService.storage.get = async () => null as any;
    const { findAllByTestId } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    fireEvent.press((await findAllByTestId('wide-mission-card-container'))[0]);
    await act(() => wait(0));
    expect(props.navigation.navigate).toBeCalledWith(expect.any(String), expect.any(Object));
    expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.MISSION_SEARCH_HISTORY, expect.any(Array));
    expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.OFFERS_SEARCH_HISTORY, expect.any(Array));
  });

  it('should navigate to a search by category when a category card was pressed', async () => {
    stateWithData.mission.categoryList = [getMissionCategory_1()];

    const categoryToSearch = stateWithData.mission.categoryList[0].name;

    props.route.params = {
      initialSearchCriteria: { search: categoryToSearch, categoryNameList: [] }
    } as any;

    mockReducer = jest.fn().mockReturnValue(stateWithData);

    const { findAllByTestId } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    fireEvent.press((await findAllByTestId('medium-category-card-container'))[0]);
    expect(props.navigation.push).toBeCalledWith(ROUTES.MISSION_SEE_ALL, {
      searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      missionListType: MissionListType.DEFAULT,
      initialSearchCriteria: { categoryNameList: [categoryToSearch] }
    });
  });

  it('should render correct placeholder for Active Missions Offers', async () => {
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    props.route.params.title = 'Active Missions Offers';
    const { toJSON } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a correct title & placeholder for empty title param', async () => {
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    props.route.params.title = '';
    const { toJSON } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a correct title & placeholder for a search that only found brands', async () => {
    props.route.params.title = '';
    stateWithData.mission.categoryList = [getMissionCategory_1()];
    const categoryToSearch = stateWithData.mission.categoryList[0].name;
    props.route.params.initialSearchCriteria = { search: categoryToSearch, categoryNameList: [] };
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { toJSON } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show recent search history list and navigate to a store', async () => {
    props.navigation.isFocused = jest.fn(() => true);
    mockReducer = jest.fn().mockReturnValue(stateWithData);

    const recentSearchHistory = [getStorageRecentSearchHistory(), getStorageRecentSearchHistory_2()];
    deps.nativeHelperService.storage.get = async () => recentSearchHistory as any;

    const { getAllByTestId } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));
    expect(getAllByTestId('recent-search-item')[0]).toBeTruthy();
    fireEvent.press(getAllByTestId('recent-search-item')[0]);
    await act(() => wait(0));
    expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.OFFERS_SEARCH_HISTORY, recentSearchHistory);
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.MISSION_DETAIL, { brandRequestorId: recentSearchHistory[0].id });
  });

  it('should show recent search history list and navigate to a category', async () => {
    props.navigation.isFocused = jest.fn(() => true);
    mockReducer = jest.fn().mockReturnValue(stateWithData);

    deps.nativeHelperService.storage.get = async () => [getStorageRecentSearchHistory(), getStorageRecentSearchHistory_2()] as any;

    const { getAllByTestId } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));

    expect(getAllByTestId('recent-search-item')[1]).toBeTruthy();

    fireEvent.press(getAllByTestId('recent-search-item')[1]);
    await act(() => wait(0));

    expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.OFFERS_SEARCH_HISTORY, [
      getStorageRecentSearchHistory_2(),
      getStorageRecentSearchHistory()
    ]);

    expect(props.navigation.push).toBeCalledWith(ROUTES.MISSION_SEE_ALL, {
      searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      missionListType: MissionListType.DEFAULT,
      initialSearchCriteria: { categoryNameList: [getStorageRecentSearchHistory_2().name] }
    });
  });

  it('should not show recent search history list when there are no items on the storage', async () => {
    props.navigation.isFocused = jest.fn(() => true);
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    deps.nativeHelperService.storage.get = async () => null as any;

    const { queryAllByTestId } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));

    expect(queryAllByTestId('recent-search-item')[0]).toBeFalsy();
  });

  it('should not show recent search history list when the user does not come to Earn', async () => {
    props.navigation.isFocused = jest.fn(() => true);
    props.route.params.isMainSearchFromEarnPage = false;
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    deps.nativeHelperService.storage.get = async () => null as any;

    const { queryAllByTestId } = render(<MissionList {...props} />, deps, stateWithData, mockReducer);
    await act(() => wait(0));

    expect(queryAllByTestId('recent-search-item')[0]).toBeFalsy();
  });

  it('should show local offer banner if category is Grocery and Delivery', async () => {
    props.route.params = {
      searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      initialSearchCriteria: { search: '', categoryNameList: [GROCERY_AND_DELIVERY_CATEGORY] },
      missionListType: MissionListType.DEFAULT
    };
    stateWithData.mission.categoryList = [getMissionCategory_3()];
    stateWithData.mission.missionMap = listToMap([getMission_1()], {}, 'uuid');
    stateWithData.mission.missionSearchMap[KnownMissionSearchKey.GENERAL_SEARCH_RESULTS] = [getMission_1().uuid];
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { queryByTestId } = render(<MissionList {...props} />, undefined, stateWithData, mockReducer);
    await waitFor(() => {
      expect(queryByTestId('local-offer-banner-container')).toBeTruthy();
    });
  });

  it("shouldn't show local offer banner if category is Grocery and Delivery", async () => {
    props.route.params = {
      searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      initialSearchCriteria: { search: '', categoryNameList: ['OTHER_CATEGORY'] },
      missionListType: MissionListType.DEFAULT
    };
    stateWithData.mission.categoryList = [getMissionCategory_3()];
    stateWithData.mission.missionMap = listToMap([getMission_1()], {}, 'uuid');
    stateWithData.mission.missionSearchMap[KnownMissionSearchKey.GENERAL_SEARCH_RESULTS] = [getMission_1().uuid];
    mockReducer = jest.fn().mockReturnValue(stateWithData);
    const { queryByTestId } = render(<MissionList {...props} />, undefined, stateWithData, mockReducer);
    await waitFor(() => {
      expect(queryByTestId('local-offer-banner-container')).toBeNull();
    });
  });
});

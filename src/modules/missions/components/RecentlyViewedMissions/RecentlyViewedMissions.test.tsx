import React from 'react';
import { ScrollView, Animated } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { getInitialState } from '_state_mgmt/GlobalState';
import { Deps, IGlobalState } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { getMission_1 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import RecentlyViewedMissions, { Props } from './RecentlyViewedMissions';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('RecentlyViewedMissions', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    initialState.mission.missionSearchMap[KnownMissionSearchKey.DYNAMIC_LIST_3] = ['test12345', 'test23456', 'test34567'];
    props = {
      data: Array.from(new Array(60)).map((_, index) => ({
        ...getMission_1(),
        uuid: String(index)
      })),
      setMissionItemRef: jest.fn(),
      itemOnPress: jest.fn(),
      viewedMissionList: [],
      onScrollEnd: jest.fn(),
      missionItemUuidPrefix: 'recently-missions',
      listType: KnownMissionSearchKey.DYNAMIC_LIST_3,
      seeAllButton: undefined
    };
    jest.spyOn(Animated, 'ScrollView' as any, 'get').mockReturnValue(ScrollView);
  });

  it('should render', () => {
    const { getByTestId } = renderWithGlobalContext(<RecentlyViewedMissions {...props} />, deps, initialState);
    expect(getByTestId('earn-main-recently-viewed-missions-section-container')).toBeTruthy();
  });

  it('should render when listType is not in mission search map', () => {
    props.listType = KnownMissionSearchKey.DYNAMIC_LIST_2;
    const { getByTestId } = renderWithGlobalContext(<RecentlyViewedMissions {...props} />, deps, initialState);
    expect(getByTestId('earn-main-recently-viewed-missions-section-container')).toBeTruthy();
  });

  it('should not render if data is empty', () => {
    props.data = [];
    const { queryByTestId } = renderWithGlobalContext(<RecentlyViewedMissions {...props} />, deps, initialState);
    expect(queryByTestId('earn-main-recently-viewed-missions-section-container')).toBeNull();
  });

  it('should render after horizontal scrolling', () => {
    const { getAllByTestId } = renderWithGlobalContext(<RecentlyViewedMissions {...props} />, deps, initialState);
    fireEvent(getAllByTestId('earn-main-recently-viewed-missions-section-horizontal-scroll')[0], 'scroll', {
      nativeEvent: {
        contentOffset: {
          x: 80
        },
        contentSize: {
          width: 500
        },
        layoutMeasurement: {
          width: 500
        }
      }
    });
    fireEvent(getAllByTestId('earn-main-recently-viewed-missions-section-horizontal-scroll')[0], 'momentumScrollEnd');
  });
});

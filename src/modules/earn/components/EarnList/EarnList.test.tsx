import React from 'react';
import { ScrollView, Animated } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';
import { getMission_1 } from '_test_utils/entities';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { CPAMissionCard } from '_modules/missions/components/CPAMissionCard';
import EarnList, { Props } from './EarnList';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: mockNavigate })
}));

describe('EarnList', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    initialState.mission.missionSearchMap[KnownMissionSearchKey.DYNAMIC_LIST_6] = ['test12345'];
    props = {
      data: Array.from(new Array(60)).map((_, index) => ({ ...getMission_1(), uuid: String(index) })),
      setMissionItemRef: jest.fn(),
      itemOnPress: jest.fn(),
      viewedMissionList: [],
      onScrollEnd: jest.fn(),
      missionItemUuidPrefix: 'list-6',
      missionCardComponent: CPAMissionCard,
      listType: KnownMissionSearchKey.DYNAMIC_LIST_6,
      seeAllButton: undefined
    };
    jest.spyOn(Animated, 'ScrollView' as any, 'get').mockReturnValue(ScrollView);
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<EarnList {...props} />, deps, initialState);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not crash if data length is 0', () => {
    props.data = [];
    const { queryByTestId, toJSON } = renderWithGlobalContext(<EarnList {...props} />, deps, initialState);
    expect(queryByTestId('earn-main-list-section-container')).toBeFalsy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('if listType is defined in mission search map see all button should exist', () => {
    props.headerShouldShowSeeAll = true;
    const { getByTestId } = renderWithGlobalContext(<EarnList {...props} />, deps, initialState);
    expect(getByTestId('earn-main-list-list-6-see-all-btn')).toBeTruthy();
  });

  it('if seeAllButton is false see all button should not exist', () => {
    props.seeAllButton = false;
    const { queryByTestId } = renderWithGlobalContext(<EarnList {...props} />, deps, initialState);
    expect(queryByTestId('earn-main-list-list-6-see-all-btn')).toBeFalsy();
  });

  it('on header press should navigate to all missions', async () => {
    props.headerShouldShowSeeAll = true;
    props.showHeaderOnPress = true;
    const { findByTestId } = renderWithGlobalContext(<EarnList {...props} />, deps, initialState);
    fireEvent.press(await findByTestId('earn-main-list-list-6-see-all-btn'));
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith(expect.any(String), expect.any(Object));
  });

  it('on header press should not navigate to all missions if showHeaderOnPress prop is false', () => {
    props.seeAllButton = true;
    props.showHeaderOnPress = false;
    const { queryByTestId } = renderWithGlobalContext(<EarnList {...props} />, deps, initialState);
    expect(queryByTestId('earn-main-list-list-6-see-all-btn')).toBeFalsy();
  });

  it('if listType is not in mission search map should render', () => {
    props.listType = KnownMissionSearchKey.DYNAMIC_LIST_2;
    const { toJSON } = renderWithGlobalContext(<EarnList {...props} />, deps, initialState);
    expect(toJSON()).toMatchSnapshot();
  });
});

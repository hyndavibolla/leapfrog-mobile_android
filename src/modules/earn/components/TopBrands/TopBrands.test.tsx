import React from 'react';
import { ScrollView, Animated } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

import TopBrands, { Props } from './TopBrands';

import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { getInitialState } from '_state_mgmt/GlobalState';
import { Deps, IGlobalState } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { getMission_1 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('TopBrands', () => {
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
      missionItemUuidPrefix: 'list-3',
      listType: KnownMissionSearchKey.DYNAMIC_LIST_3,
      seeAllButton: undefined
    };
    jest.spyOn(Animated, 'ScrollView' as any, 'get').mockReturnValue(ScrollView);
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<TopBrands {...props} />, deps, initialState);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should navigate to all missions when see all button was pressed', async () => {
    const { findByTestId } = renderWithGlobalContext(<TopBrands {...props} />, deps, initialState);
    fireEvent.press(await findByTestId('earn-main-top-brands-list-3-see-all-btn'));
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith(expect.any(String), expect.any(Object));
  });

  it('should render see all button when listType is defined in mission search map', () => {
    const { getByTestId } = renderWithGlobalContext(<TopBrands {...props} />, deps, initialState);
    expect(getByTestId('earn-main-top-brands-list-3-see-all-btn')).toBeTruthy();
  });

  it('should not render see all button when seeAllButton property is false', () => {
    props.seeAllButton = false;
    const { queryByTestId } = renderWithGlobalContext(<TopBrands {...props} />, deps, initialState);
    expect(queryByTestId('earn-main-top-brands-list-3-see-all-btn')).toBeNull();
  });

  it('should render when listType is not in mission search map', () => {
    props.listType = KnownMissionSearchKey.DYNAMIC_LIST_2;
    const { toJSON } = renderWithGlobalContext(<TopBrands {...props} />, deps, initialState);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not render if data is empty', () => {
    props.data = [];
    const { queryByTestId } = renderWithGlobalContext(<TopBrands {...props} />, deps, initialState);
    expect(queryByTestId('earn-main-top-brands-section-container')).toBeNull();
  });

  it('should render after horizontal scrolling', () => {
    const { toJSON, getAllByTestId } = renderWithGlobalContext(<TopBrands {...props} />, deps, initialState);
    fireEvent(getAllByTestId('earn-main-top-brands-section-horizontal-scroll')[0], 'scroll', {
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
    fireEvent(getAllByTestId('earn-main-top-brands-section-horizontal-scroll')[0], 'momentumScrollEnd');
    expect(toJSON()).toMatchSnapshot();
  });
});

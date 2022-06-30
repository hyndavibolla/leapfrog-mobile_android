import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import MissionSelectCategory, { Props } from './MissionSelectCategory';

import { getInitialState } from '_state_mgmt/GlobalState';

import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { Deps, IGlobalState } from '_models/general';
import { MissionListType } from '_models/mission';
import { getMissionCategory_1, getMissionCategory_2 } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { ROUTES } from '_constants/routes';

let mockedReplace;
let mockedGoBack;
let mockedDispatch;
jest.mock('@react-navigation/native', () => {
  const actualNavigator = jest.requireActual('@react-navigation/native');
  return {
    ...actualNavigator,
    useNavigation: () => ({
      replace: mockedReplace,
      goBack: mockedGoBack,
      dispatch: mockedDispatch
    })
  };
});

describe('MissionSelectCategory', () => {
  let props: Props;
  let deps: Deps;
  let stateWithCategories: any;
  let initialState: IGlobalState;

  beforeEach(() => {
    mockedReplace = jest.fn();
    mockedGoBack = jest.fn();
    mockedDispatch = jest.fn();
    initialState = getInitialState();
    props = {
      route: {
        params: {
          searchKey: 'searchKey',
          placeholder: 'placeholder'
        }
      }
    };
    stateWithCategories = {
      ...initialState,
      mission: {
        ...initialState.mission,
        categoryList: [getMissionCategory_1(), getMissionCategory_2()]
      }
    };
    deps = getMockDeps();
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<MissionSelectCategory {...props} />, deps, stateWithCategories);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should navigate to search when a category was selected', () => {
    const { getByTestId, getAllByTestId } = renderWithGlobalContext(<MissionSelectCategory {...props} />, deps, stateWithCategories);

    fireEvent.press(getAllByTestId('category-card-container')[0]);
    fireEvent.press(getByTestId('mission-select-category-apply'));

    expect(mockedReplace).toBeCalledWith(ROUTES.MISSION_SEE_ALL, {
      searchKey: props.route.params.searchKey,
      initialSearchCriteria: {
        categoryNameList: [getMissionCategory_1().name]
      },
      missionListType: MissionListType.DEFAULT,
      title: props.route.params.placeholder.replace('Search in ', '')
    });
  });

  it('should navigate to search when there is not placeholder and apply button was pressed', () => {
    props.route.params.placeholder = undefined;
    props.route.params.searchKey = undefined;

    const { getByTestId, getAllByTestId } = renderWithGlobalContext(<MissionSelectCategory {...props} />, deps, stateWithCategories);

    fireEvent.press(getAllByTestId('category-card-container')[0]);
    fireEvent.press(getByTestId('mission-select-category-apply'));

    expect(mockedReplace).toBeCalledWith(ROUTES.MISSION_SEE_ALL, {
      searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      initialSearchCriteria: {
        categoryNameList: [getMissionCategory_1().name]
      },
      missionListType: MissionListType.DEFAULT,
      title: 'Stores or Categories'
    });
  });

  it('should NOT show submit button when there are not selected categories', () => {
    const { queryByTestId } = renderWithGlobalContext(<MissionSelectCategory {...props} />, deps, stateWithCategories);
    expect(queryByTestId('mission-select-category-apply')).toBeNull();
  });

  it('should NOT submit when press apply without interacting with categories', () => {
    props.route.params.selectedCategoryNames = [getMissionCategory_1().name];

    const { getByTestId } = renderWithGlobalContext(<MissionSelectCategory {...props} />, deps, stateWithCategories);

    fireEvent.press(getByTestId('mission-select-category-apply'));
    expect(mockedReplace).not.toBeCalled();
    expect(mockedGoBack).toBeCalled();
  });

  it('should NOT hide submit button when toggling categories and leaving the same selection it started with', () => {
    const { queryByTestId, getAllByTestId } = renderWithGlobalContext(<MissionSelectCategory {...props} />, deps, stateWithCategories);

    fireEvent.press(getAllByTestId('category-card-container')[0]);
    expect(queryByTestId('mission-select-category-apply')).toBeTruthy();
    fireEvent.press(getAllByTestId('category-card-container')[0]);
    expect(queryByTestId('mission-select-category-apply')).toBeNull();
  });

  it('should clear all', async () => {
    props.route.params.selectedCategoryNames = [getMissionCategory_1().name];

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<MissionSelectCategory {...props} />, deps, stateWithCategories);

    expect(queryByTestId('mission-select-category-apply')).toBeTruthy();
    fireEvent.press(getByTestId('mission-select-category-clear-all'));
    expect(queryByTestId('mission-select-category-apply')).toBeNull();
    expect(mockedReplace).not.toBeCalled();
  });

  it('should clean the previous route', async () => {
    props.route.params.placeholder = undefined;
    props.route.params.searchKey = undefined;
    stateWithCategories.core.routeHistory = [ROUTES.MISSION_SELECT_CATEGORY, ROUTES.MISSION_SEE_ALL];

    const { getByTestId, getAllByTestId } = renderWithGlobalContext(<MissionSelectCategory {...props} />, deps, stateWithCategories);

    fireEvent.press(getAllByTestId('category-card-container')[0]);
    fireEvent.press(getByTestId('mission-select-category-apply'));
    expect(mockedDispatch).toBeCalled();
  });
});

import React from 'react';
import { TextInput } from 'react-native';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import MissionSearchInput, { buildMissionSearchCriteria, Props, MissionSearchInputVariant } from './MissionSearchInput';

import { getInitialState } from '_state_mgmt/GlobalState';
import { ACTION_TYPE } from '_state_mgmt/mission/actions';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { Deps, IGlobalState } from '_models/general';
import { MissionListType } from '_models/mission';
import { getMissionCategory_1, getMissionCategory_2 } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { ENV, ROUTES } from '_constants';

let mockedPush;
jest.mock('@react-navigation/native', () => {
  const actualNavigator = jest.requireActual('@react-navigation/native');
  return {
    ...actualNavigator,
    useNavigation: () => ({
      push: mockedPush
    })
  };
});

describe('MissionSearchInput', () => {
  let props: Props;
  let deps: Deps;
  let stateWithCategories: any;
  let render;
  let initialState: IGlobalState;

  beforeEach(() => {
    mockedPush = jest.fn();
    initialState = getInitialState();
    props = {
      value: '',
      onChange: jest.fn(),
      disabled: false
    };
    stateWithCategories = {
      ...initialState,
      mission: { ...initialState.mission, categoryList: [getMissionCategory_1(), getMissionCategory_2()] }
    };
    deps = getMockDeps();
    const { Screen, Navigator } = createStackNavigator();
    render = (p, d, s, c) => {
      const Component = () => <MissionSearchInput {...props} {...(p || {})} />;
      return renderWithGlobalContext(
        <NavigationContainer>
          <Navigator>
            <Screen name="route" component={Component} />
            <Screen name={ROUTES.MISSION_SEE_ALL} component={Component} />
          </Navigator>
        </NavigationContainer>,
        d,
        s,
        c
      );
    };
  });

  it('should render', async () => {
    const { toJSON, mockReducer } = render(<MissionSearchInput {...props} />);

    await waitFor(() => {
      expect(mockReducer).toBeCalledWith(
        expect.any(Object),
        expect.objectContaining({
          type: ACTION_TYPE.SET_CATEGORY_LIST
        })
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render with a critical error', async () => {
    deps.apiService.fetchMissionCategoryList = jest.fn().mockRejectedValueOnce('error');

    const { toJSON } = render(<MissionSearchInput {...props} />, deps);

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should change', async () => {
    const search = 'anything';
    const { findByTestId } = render(<MissionSearchInput {...props} />);

    fireEvent.changeText(await findByTestId('search-input-input'), search);
    expect(props.onChange).toBeCalledWith(search);
  });

  it('should navigate to mission select category when filter button was pressed', async () => {
    props.searchKey = 'searchKey';
    props.placeholder = 'placeholder';
    props.variant = MissionSearchInputVariant.LIGHT;
    props.selectedCategoryNames = [getMissionCategory_1().name];

    const { findByTestId } = render(<MissionSearchInput {...props} />, undefined, stateWithCategories);

    fireEvent.press(await findByTestId('search-input-filter-btn'));
    expect(mockedPush).toBeCalledWith(ROUTES.MISSION_SELECT_CATEGORY, {
      searchKey: props.searchKey,
      placeholder: props.placeholder
    });
  });

  it('should NOT search by text when min is not met', async () => {
    props.value = 'a';
    const { findByTestId } = render(<MissionSearchInput {...props} />);
    fireEvent(await findByTestId('search-input-input'), 'submitEditing');
    expect(mockedPush).not.toBeCalled();
  });

  it('should search with not empty text', async () => {
    props.value = 'ash';
    const { findByTestId } = render(<MissionSearchInput {...props} />);

    fireEvent(await findByTestId('search-input-input'), 'submit');
    expect(mockedPush).toBeCalledWith(ROUTES.MISSION_SEE_ALL, {
      searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      initialSearchCriteria: buildMissionSearchCriteria(
        {
          search: props.value,
          categoryNameList: []
        },
        []
      ),
      missionListType: MissionListType.DEFAULT,
      title: 'Stores or Categories'
    });
  });

  it('should not search with empty text', async () => {
    props.value = '';
    const { findByTestId } = render(<MissionSearchInput {...props} />);

    fireEvent(await findByTestId('search-input-input'), 'submit');
    expect(mockedPush).not.toBeCalled();
  });

  it('should submit with placeholder', async () => {
    props.value = 'ash';
    props.placeholder = 'active missions offers';

    const { findByTestId } = render(<MissionSearchInput {...props} />);

    fireEvent(await findByTestId('search-input-input'), 'submit');
    expect(mockedPush).toBeCalledWith(ROUTES.MISSION_SEE_ALL, {
      searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      initialSearchCriteria: buildMissionSearchCriteria(
        {
          search: props.value,
          categoryNameList: []
        },
        []
      ),
      missionListType: MissionListType.DEFAULT,
      title: 'active missions offers'
    });
  });

  it('should render with search dropdown open', async () => {
    TextInput.prototype.isFocused = () => true;

    deps.nativeHelperService.storage.get = jest.fn().mockImplementationOnce(() => {
      return Array.from(Array(ENV.MISSION_SEARCH_HISTORY_LENGTH * 2)).map((_, i) => ({
        keyword: String(i),
        lastUpdatedAt: i
      }));
    });

    const { findByTestId, toJSON } = render(<MissionSearchInput {...props} />, deps);
    fireEvent(await findByTestId('search-input-input'), 'focus');
    expect(toJSON()).toMatchSnapshot();
  });

  describe('buildMissionSearchCriteria', () => {
    it('should build a search criteria with NO category matches', () => {
      expect(
        buildMissionSearchCriteria(
          {
            search: 'a',
            categoryNameList: ['b']
          },
          ['c']
        )
      ).toEqual({
        search: 'a',
        categoryNameList: ['b']
      });
    });

    it('should build a search criteria with category matches', () => {
      expect(
        buildMissionSearchCriteria(
          {
            search: 'c',
            categoryNameList: ['b']
          },
          ['c']
        )
      ).toEqual({
        search: '',
        categoryNameList: ['c']
      });
    });

    it('should build a search criteria with category matches that were already selected', () => {
      expect(
        buildMissionSearchCriteria(
          {
            search: 'c',
            categoryNameList: ['c']
          },
          ['c']
        )
      ).toEqual({
        search: '',
        categoryNameList: ['c']
      });
    });
  });
});

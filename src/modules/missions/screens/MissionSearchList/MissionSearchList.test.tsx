import React from 'react';
import { fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native';

import MissionSearchList, { Props } from './MissionSearchList';

import { getInitialState } from '_state_mgmt/GlobalState';
import { GeneralModel } from '_models';
import { Deps } from '_models/general';

import { getMockDeps } from '_test_utils/getMockDeps';
import { getMission_1 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { ROUTES } from '_constants/routes';

describe('MissionSearchList', () => {
  let state: GeneralModel.IGlobalState;
  let deps: Deps;
  let props: Props;

  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
    props = {
      navigation: {
        navigate: jest.fn()
      } as any,
      route: {
        params: {
          streakId: 'streak-1'
        }
      }
    };
  });

  it('should render', async () => {
    deps.apiService.fetchMissionList = jest.fn().mockResolvedValueOnce({
      userId: 'buttonId',
      missions: Array.from(new Array(60)).map((_, index) => ({
        ...getMission_1(),
        uuid: String(index)
      }))
    });
    const { toJSON } = renderWithGlobalContext(<MissionSearchList {...props} />, deps, state);
    await waitFor(() => expect(toJSON()).toMatchSnapshot());
  });

  it('should render the skeleton while the data is fetching and then remove it', async () => {
    deps.apiService.fetchMissionList = jest.fn().mockResolvedValueOnce({
      userId: 'buttonId',
      missions: Array.from(new Array(60)).map((_, index) => ({
        ...getMission_1(),
        uuid: String(index)
      }))
    });
    const { getByTestId } = renderWithGlobalContext(<MissionSearchList {...props} />, deps, state);
    await waitForElementToBeRemoved(() => getByTestId('streak-list-skeleton-container'));
  });

  it('should render a empty state when there are no missions', async () => {
    deps.apiService.fetchMissionList = jest.fn().mockResolvedValueOnce({
      userId: 'buttonId',
      missions: []
    });
    const { getByTestId } = renderWithGlobalContext(<MissionSearchList {...props} />, deps, state);
    await waitFor(() => expect(getByTestId('streak-list-empty-state')).toBeTruthy());
  });

  it('should navigate to mission detail when a mission was pressed', async () => {
    deps.apiService.fetchMissionList = jest.fn().mockResolvedValueOnce({
      userId: 'buttonId',
      missions: Array.from(new Array(60)).map((_, index) => ({
        ...getMission_1(),
        uuid: String(index)
      }))
    });

    const { findAllByTestId } = renderWithGlobalContext(<MissionSearchList {...props} />, deps, state);

    fireEvent.press((await findAllByTestId('streak-list-brand-container-btn'))[0]);
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.MISSION_DETAIL, {
      brandRequestorId: getMission_1().brandRequestorId,
      isAvailableStreakIndicator: true
    });
  });
});

import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import navigation from '@react-navigation/native';

import MissionBrandsSection, { Props } from './MissionBrandsSection';

import { getInitialState } from '_state_mgmt/GlobalState';
import { Deps, IGlobalState } from '_models/general';
import { TransactionFilter } from '_models/offer';

import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMission_1 } from '_test_utils/entities';

import { wait } from '_utils/wait';
import { ROUTES } from '_constants';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return { useNavigation: () => ({ navigate: mockedNavigate }) };
});

describe('Mission Brands Section', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    navigation.useIsFocused = jest.fn(() => true);
    props = {
      transactionType: TransactionFilter.ALL_TRANSACTIONS
    };
    deps = getMockDeps();
    initialState = getInitialState();
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<MissionBrandsSection {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should navigate to mission detail when a top brand is pressed', async () => {
    const missionList = Array.from(new Array(60)).map((_, index) => ({ ...getMission_1(), offerId: String(index) }));
    deps.apiService.fetchMissionList = jest.fn(async ({ listType }) => ({ userId: 'buttonUserId', missions: missionList, title: 'title', listType }));

    const { getAllByTestId } = renderWithGlobalContext(<MissionBrandsSection {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('mission-brands-section-brand')[0]);
    await act(() => wait(0));
    expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.MISSION_DETAIL, { brandRequestorId: getMission_1().brandRequestorId, isAvailableStreakIndicator: true });
  });

  it('should render nothing when top brands list is empty', async () => {
    deps.apiService.fetchMissionList = jest.fn().mockRejectedValueOnce('error');

    const { queryAllByTestId } = renderWithGlobalContext(<MissionBrandsSection {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(queryAllByTestId('mission-brands-section-brand')[0]).toBeFalsy();
  });

  it('should not fetch gift cards when the component is not focused', async () => {
    navigation.useIsFocused = jest.fn(() => false);
    deps.apiService.fetchMissionList = jest.fn(async ({ listType }) => ({ userId: 'buttonUserId', missions: [], title: 'title', listType }));

    renderWithGlobalContext(<MissionBrandsSection {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(deps.apiService.fetchStreakList).not.toBeCalled();
  });
});

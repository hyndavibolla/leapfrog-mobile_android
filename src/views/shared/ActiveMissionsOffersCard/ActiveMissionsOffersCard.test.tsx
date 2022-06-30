import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

import ActiveMissionsOffersCard, { Props } from './ActiveMissionsOffersCard';

import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';

import { wait } from '_utils/wait';
import { getMission_1 } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { ROUTES } from '_constants/routes';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return { useNavigation: () => ({ navigate: mockedNavigate }) };
});

describe('Active Missions Offers Card', () => {
  let deps: Deps;
  let initialState: IGlobalState;
  let props: Props;
  const mission = getMission_1();

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    props = {
      mission: mission,
      streakIndicator: false
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<ActiveMissionsOffersCard {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should navigate to mission detail', async () => {
    props.mission.pointsAwarded = null;
    const { getByTestId } = renderWithGlobalContext(<ActiveMissionsOffersCard {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId('active-missions-offers-card-container'));
    await act(() => wait(0));
    expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.MISSION_DETAIL, { brandRequestorId: mission.brandRequestorId, isAvailableStreakIndicator: false });
  });
});

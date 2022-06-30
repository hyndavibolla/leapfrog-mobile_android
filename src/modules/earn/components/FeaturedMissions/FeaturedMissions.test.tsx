import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { ROUTES } from '_constants';
import { Deps, IGlobalState } from '_models/general';
import { getStreak_1 } from '_test_utils/entities';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { createUUID } from '_utils/create-uuid';
import { wait } from '_utils/wait';
import FeaturedMissions, { Props } from './FeaturedMissions';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: mockNavigate })
}));

describe('FeaturedMissions', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    deps = getMockDeps();
    initialState = getInitialState();
    props = {
      focusKey: createUUID(),
      isLoadingCallback: jest.fn()
    };
  });

  it('should render', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockResolvedValue([{ ...getStreak_1(), currentQualifiedValue: 3, thresholdValue: 3 }]);
    const { toJSON } = renderWithGlobalContext(<FeaturedMissions {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('on mission click navigate to missions screen', async () => {
    const { queryAllByTestId } = renderWithGlobalContext(<FeaturedMissions {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(queryAllByTestId('large-streak-card-container')[0]);
    expect(mockNavigate).toBeCalledWith(ROUTES.MAIN_TAB.STREAK);
  });

  it('should refresh data by default', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockResolvedValue([{ ...getStreak_1(), currentQualifiedValue: 3, thresholdValue: 3 }]);
    initialState.core.routeHistory = [ROUTES.MAIN_TAB.EARN, ROUTES.MAIN_TAB.WALLET];
    const { toJSON } = renderWithGlobalContext(<FeaturedMissions {...props} />, deps, initialState);
    expect(deps.apiService.fetchStreakList).toBeCalledTimes(1);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });
});

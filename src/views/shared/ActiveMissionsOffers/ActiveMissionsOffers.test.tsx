import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import ActiveMissionsOffers, { Props } from './ActiveMissionsOffers';

import { getInitialState } from '_state_mgmt/GlobalState';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { Deps, IGlobalState } from '_models/general';
import { MissionListType } from '_models/mission';

import { getMission_1, getMission_2, getMission_3 } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { ROUTES } from '_constants/routes';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return { useNavigation: () => ({ navigate: mockedNavigate }) };
});

describe('Active Missions Offers', () => {
  let deps: Deps;
  let initialState: IGlobalState;
  let props: Props;
  const offers = [getMission_1(), getMission_2(), getMission_3()];
  const title = 'Active Missions Offers';

  beforeEach(() => {
    initialState = getInitialState();
    initialState.mission.missionListTitleMap[KnownMissionSearchKey.DYNAMIC_LIST_2] = title;
    deps = getMockDeps();
    props = {
      offers: offers
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<ActiveMissionsOffers {...props} />, deps, initialState);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render the offers like a grid', async () => {
    const { findByTestId } = renderWithGlobalContext(<ActiveMissionsOffers {...props} />, deps, initialState);
    expect(await findByTestId('active-missions-offers-grid')).toBeTruthy();
  });

  it('should navigate to mission detail if seeAllButton is true', async () => {
    props.seeAllButton = true;
    const { findByTestId } = renderWithGlobalContext(<ActiveMissionsOffers {...props} />, deps, initialState);
    fireEvent.press(await findByTestId('active-missions-offers-see-all'));
    expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.MISSION_SEE_ALL, {
      searchKey: KnownMissionSearchKey.SEE_ALL,
      missionListType: MissionListType.DYNAMIC_LIST_2,
      title,
      listTitle: title
    });
  });

  it('should not render see all button if seeAllButton prop is undefined', () => {
    const { queryByTestId } = renderWithGlobalContext(<ActiveMissionsOffers {...props} />, deps, initialState);
    expect(queryByTestId('active-missions-offers-see-all')).toBeNull();
  });
});

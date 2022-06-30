import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { getAwardCondition_2, getMission_1, getMission_3 } from '_test_utils/entities';
import { MissionModel } from '_models';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';

import SmallMissionCard, { Props, Orientation } from './SmallMissionCard';

describe('SmallMissionCard', () => {
  let props: Props;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();

    props = {
      mission: getMission_1(),
      orientation: Orientation.HORIZONTAL,
      onPress: jest.fn()
    };
  });

  it('should render horizontal by default', () => {
    const { toJSON } = renderWithGlobalContext(<SmallMissionCard {...props} orientation={undefined} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render vertical', () => {
    const { toJSON } = renderWithGlobalContext(<SmallMissionCard {...props} orientation={Orientation.VERTICAL} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should with a fallback image', () => {
    props.mission.brandLogo = null;
    const { toJSON } = renderWithGlobalContext(<SmallMissionCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should with a bottom text', () => {
    props.mission.pointsAwarded.rewardType = MissionModel.RedemptionType.POINT_PER_DOLLAR;
    const { toJSON } = renderWithGlobalContext(<SmallMissionCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable', async () => {
    const { findByTestId } = renderWithGlobalContext(<SmallMissionCard {...props} />);
    fireEvent.press(await findByTestId('small-mission-card-container'));
    expect(props.onPress).toBeCalled();
  });

  it('should render default points', () => {
    const mission = getMission_3();
    initialState.mission.missionMap = { ['12345']: mission };
    initialState.game.current.missions.pointsPerCent = 10;
    const { queryAllByTestId, toJSON } = renderWithGlobalContext(<SmallMissionCard {...props} />, getMockDeps(), initialState);
    expect(toJSON()).toMatchSnapshot();
    expect(queryAllByTestId('pill-text')[0].children[0]).toEqual('200');
  });

  it('should render points from sorted conditions', () => {
    const mission = {
      ...getMission_3(),
      pointsAwarded: {
        rewardValue: 200,
        rewardType: MissionModel.RedemptionType.FIXED_POINTS,
        conditions: [getAwardCondition_2(), getAwardCondition_2()]
      }
    };
    initialState.mission.missionMap = { ['1234']: mission };
    initialState.game.current.missions.pointsPerCent = 12;
    props.mission = mission;
    const { queryAllByTestId, toJSON } = renderWithGlobalContext(<SmallMissionCard {...props} />, getMockDeps(), initialState);
    expect(toJSON()).toMatchSnapshot();
    expect(queryAllByTestId('pill-text')[0].children[0]).toEqual('200');
  });
});

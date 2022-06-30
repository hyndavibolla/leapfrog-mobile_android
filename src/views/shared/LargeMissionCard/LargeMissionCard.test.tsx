import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { getAwardCondition_2, getMission_1, getMission_2, getMission_3 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';
import { MissionModel } from '_models';
import { IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';

import LargeMissionCard, { Props } from './LargeMissionCard';

describe('LargeMissionCard', () => {
  let onPress: () => void;
  let props: Props;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    onPress = jest.fn();
    props = {
      onPress,
      mission: getMission_1()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<LargeMissionCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render full size', () => {
    const { toJSON } = renderWithGlobalContext(<LargeMissionCard {...props} fullSize={true} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with points and dollars mission', () => {
    const { toJSON } = renderWithGlobalContext(<LargeMissionCard {...props} mission={getMission_2()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with points only mission', () => {
    const { toJSON } = renderWithGlobalContext(<LargeMissionCard {...props} mission={getMission_3()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable ', () => {
    const { getByTestId } = renderWithGlobalContext(<LargeMissionCard {...props} />);
    fireEvent.press(getByTestId('large-mission-card-container'));
    expect(props.onPress).toBeCalled();
  });

  it('should render default points', async () => {
    const mission = getMission_3();
    initialState.mission.missionMap = { ['12345']: mission };
    initialState.game.current.missions.pointsPerCent = 10;
    const { queryAllByTestId, toJSON } = renderWithGlobalContext(<LargeMissionCard {...props} />, getMockDeps(), initialState);
    expect(toJSON()).toMatchSnapshot();
    expect(queryAllByTestId('pill-text')[0].children[0]).toEqual('200');
  });

  it('should render points from sorted conditions', async () => {
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
    const { queryAllByTestId, toJSON } = renderWithGlobalContext(<LargeMissionCard {...props} />, getMockDeps(), initialState);
    expect(toJSON()).toMatchSnapshot();
    expect(queryAllByTestId('pill-text')[0].children[0]).toEqual('200');
  });
});

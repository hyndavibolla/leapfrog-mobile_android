import React from 'react';

import { ButtonCreativeType, Deps, IGlobalState } from '_models/general';
import { PetiteMissionCard } from '_components/PetiteMissionCard';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMission_1 } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import MissionImpressionView, { Props } from './MissionImpressionView';

describe('MissionImpressionView', () => {
  let onPress: () => void;
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    onPress = jest.fn();
    props = {
      onPress,
      mission: getMission_1(),
      wasViewed: false,
      missionCardComponent: PetiteMissionCard,
      creativeType: ButtonCreativeType.OTHER,
      streakIndicator: false
    };
  });

  it('should render', () => {
    initialState.mission.isButtonInit = true;
    const { toJSON } = renderWithGlobalContext(<MissionImpressionView {...props} />, deps, initialState);
    expect(deps.nativeHelperService.buttonSdk.configure).not.toBeCalled();
    expect(deps.nativeHelperService.buttonSdk.setUserId).not.toBeCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render viewed', () => {
    initialState.mission.isButtonInit = true;
    const { toJSON } = renderWithGlobalContext(<MissionImpressionView {...props} wasViewed={true} />, deps, initialState);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should initialize button if not initialized', () => {
    initialState.mission = { ...initialState.mission, isButtonInit: false, buttonUserId: '1234' };
    renderWithGlobalContext(<MissionImpressionView {...props} />, deps, initialState);
    expect(deps.nativeHelperService.buttonSdk.configure).toBeCalled();
    expect(deps.nativeHelperService.buttonSdk.setUserId).toBeCalled();
  });
});

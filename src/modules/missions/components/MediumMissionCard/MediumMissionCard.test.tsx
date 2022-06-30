import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { getMission_1, getMission_2, getMission_3 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import MediumMissionCard, { Props } from './MediumMissionCard';

describe('MediumMissionCard', () => {
  let onPress: () => void;
  let props: Props;
  beforeEach(() => {
    onPress = jest.fn();
    props = {
      onPress,
      mission: getMission_1()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<MediumMissionCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with points and dollars mission', () => {
    const { toJSON } = renderWithGlobalContext(<MediumMissionCard {...props} mission={getMission_2()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with points only mission', () => {
    const { toJSON } = renderWithGlobalContext(<MediumMissionCard {...props} mission={getMission_3()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable ', () => {
    const { getByTestId } = renderWithGlobalContext(<MediumMissionCard {...props} />);
    fireEvent.press(getByTestId('medium-mission-card-container'));
    expect(props.onPress).toBeCalled();
  });

  it('should render with streak tag', () => {
    props.hasStreakTag = true;
    const { getByTestId } = renderWithGlobalContext(<MediumMissionCard {...props} />);
    expect(getByTestId('medium-mission-card-streak-tag')).toBeTruthy();
  });
});

import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import WideMissionCard, { Props } from './WideMissionCard';
import { getMission_1, getMission_2, getMission_3 } from '../../../test-utils/entities';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

describe('WideMissionCard', () => {
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
    const { toJSON } = renderWithGlobalContext(<WideMissionCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with points and dollars mission', () => {
    const { toJSON } = renderWithGlobalContext(<WideMissionCard {...props} mission={getMission_2()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with points only mission', () => {
    const { toJSON } = renderWithGlobalContext(<WideMissionCard {...props} mission={getMission_3()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable ', () => {
    const { getByTestId } = renderWithGlobalContext(<WideMissionCard {...props} />);
    fireEvent.press(getByTestId('wide-mission-card-container'));
    expect(props.onPress).toBeCalled();
  });

  it('should render with streak tag', () => {
    props.hasStreakTag = true;
    const { getByTestId } = renderWithGlobalContext(<WideMissionCard {...props} />);
    expect(getByTestId('wide-mission-card-streak-tag')).toBeTruthy();
  });
});

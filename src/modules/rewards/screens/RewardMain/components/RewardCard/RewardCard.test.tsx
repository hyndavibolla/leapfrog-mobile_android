import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { COLOR } from '_constants';

import RewardCard, { Props, RewardCardTheme } from './RewardCard';

describe('RewardCard', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      title: '31,500',
      description: 'OF 34,999',
      image: <View />,
      onPress: jest.fn()
    };
  });

  it('should render ', () => {
    const { toJSON } = render(<RewardCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with specific color and with dark theme', () => {
    const { toJSON } = render(<RewardCard {...props} color={COLOR.PRIMARY_BLUE} theme={RewardCardTheme.DARK} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with specific without color and with dark theme', () => {
    const { toJSON } = render(<RewardCard {...props} theme={RewardCardTheme.DARK} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable', () => {
    const { getByTestId } = render(<RewardCard {...props} theme={RewardCardTheme.DARK} />);
    fireEvent.press(getByTestId('reward-card-container'));
    expect(props.onPress).toBeCalled();
  });
});

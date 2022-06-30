import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import LevelBenefit from './LevelBenefit';
import { Props } from './LevelBenefit';

describe('LevelBenefit', () => {
  let onPress: () => void;
  let props: Props;
  beforeEach(() => {
    onPress = jest.fn();
    props = {
      onPress
    };
  });

  it('should render', () => {
    const { toJSON } = render(<LevelBenefit onPress={props.onPress} boosted={false} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render boosted', () => {
    const { toJSON } = render(<LevelBenefit onPress={props.onPress} boosted={true} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without actions', () => {
    const { toJSON } = render(<LevelBenefit />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable', () => {
    const { getByTestId } = render(<LevelBenefit onPress={props.onPress} />);
    fireEvent.press(getByTestId('level-benefits-btn'));
    expect(props.onPress).toBeCalled();
  });
});

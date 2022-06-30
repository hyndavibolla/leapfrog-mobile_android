import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { Deps } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import CreditCard, { Props } from './CreditCard';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('CreditCard', () => {
  let onPress = jest.fn();
  let props: Props;
  let deps: Deps;

  beforeEach(() => {
    props = {
      onPress,
      userHasSywCard: false
    };
    deps = getMockDeps();
  });

  it('should be pressable', () => {
    props.userHasSywCard = true;
    const { getByTestId } = renderWithGlobalContext(<CreditCard {...props} />, deps);
    fireEvent.press(getByTestId('credit-card-card-container'));
    expect(props.onPress).toBeCalled();
  });

  it('should render without SYW Card', () => {
    const { toJSON } = renderWithGlobalContext(<CreditCard {...props} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });
});

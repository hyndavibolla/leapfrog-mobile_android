import React from 'react';
import { Animated, View } from 'react-native';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import TranslateSearchBarWrapper, { Props } from './TranslateSearchBarWrapper';

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: jest.fn() })
}));

describe('TranslateSearchBarWrapper', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      translateY: {} as Animated.AnimatedInterpolation,
      children: <View />
    };
  });

  it('should render', () => {
    const { getByTestId } = renderWithGlobalContext(<TranslateSearchBarWrapper {...props} />);
    expect(getByTestId('translate-searchbar-wrapper-container')).toBeTruthy();
  });
});

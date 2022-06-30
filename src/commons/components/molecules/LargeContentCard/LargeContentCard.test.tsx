import React from 'react';
import { Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import LargeContentCard, { Props, Theme } from './LargeContentCard';
import { styles } from './styles';

describe('LargeContentCard', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      backgroundImage: require('_assets/shared/claimGetGiftCards.png'),
      title: 'Get your Gift Cards!',
      description: 'Discover all your favorite brands',
      children: <Text>CTA</Text>,
      theme: Theme.LIGHT,
      onPress: jest.fn()
    };
  });

  it('should render with light theme', () => {
    const { getByTestId } = renderWithGlobalContext(<LargeContentCard {...props} />);
    expect(getByTestId('large-content-card-title')).toHaveStyle(styles.light);
    expect(getByTestId('large-content-card-subtitle')).toHaveStyle(styles.light);
  });

  it('should render with dark theme', () => {
    props.theme = Theme.DARK;
    const { getByTestId } = renderWithGlobalContext(<LargeContentCard {...props} />);

    expect(getByTestId('large-content-card-title')).toHaveStyle(styles.dark);
    expect(getByTestId('large-content-card-subtitle')).toHaveStyle(styles.dark);
  });

  it('should call onPress', () => {
    const { getByTestId } = renderWithGlobalContext(<LargeContentCard {...props} />);
    fireEvent.press(getByTestId('large-content-card-container'));
    expect(props.onPress).toBeCalled();
  });
});

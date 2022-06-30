import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import CategoryCard, { Props } from './CategoryCard';

describe('CategoryCard', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      image: 'pets.png',
      label: 'Pets',
      onPress: jest.fn(),
      isSelected: true
    };
  });

  it('should render', () => {
    const { toJSON } = render(<CategoryCard />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable', async () => {
    const { getByTestId } = render(<CategoryCard {...props} />);
    fireEvent.press(getByTestId('category-card-container'));
    expect(props.onPress).toBeCalled();
  });
});

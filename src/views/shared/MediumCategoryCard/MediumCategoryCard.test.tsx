import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import MediumCategoryCard, { Props } from './MediumCategoryCard';
import { getMissionCategory_1 } from '../../../test-utils/entities';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

describe('MediumCategoryCard', () => {
  let props: Props;
  beforeEach(() => {
    const category = getMissionCategory_1();
    props = {
      title: category.name,
      backgroundUrl: category.lifestyleUrl,
      onPress: jest.fn()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<MediumCategoryCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable', () => {
    const { getByTestId } = renderWithGlobalContext(<MediumCategoryCard {...props} />);
    fireEvent.press(getByTestId('medium-category-card-container'));
    expect(props.onPress).toBeCalled();
  });
});

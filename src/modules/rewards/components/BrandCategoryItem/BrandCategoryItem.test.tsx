import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { Props, BrandCategoryItem } from './BrandCategoryItem';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getSlideBrand_1, getSlideBrand_4 } from '_test_utils/entities';

describe('BrandCategoryItem', () => {
  let props: Props;
  const onPressItemCallback = jest.fn();

  beforeEach(() => {
    props = {
      rewardBrand: getSlideBrand_1(),
      onPress: () => onPressItemCallback
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<BrandCategoryItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should press a fallback item', () => {
    const { getByTestId } = renderWithGlobalContext(<BrandCategoryItem {...props} />);
    fireEvent.press(getByTestId('brand-category-item-fallback-card'));
    expect(onPressItemCallback).toBeCalled();
  });

  it('should press a medium card item', () => {
    props.rewardBrand = getSlideBrand_4();
    const { getByTestId } = renderWithGlobalContext(<BrandCategoryItem {...props} />);
    fireEvent.press(getByTestId('medium-category-card-container'));
    expect(onPressItemCallback).toBeCalled();
  });
});

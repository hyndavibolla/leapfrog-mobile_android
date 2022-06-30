import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { Props, BrandCategory } from './BrandCategory';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getSlideBrand_1, getSlideBrand_3, getSlideBrand_4 } from '_test_utils/entities';

describe('BrandCategory', () => {
  let props: Props;
  const onPressSeeAllCallback = jest.fn();
  const onPressItemCallback = jest.fn();

  beforeEach(() => {
    props = {
      categoryName: getSlideBrand_1().categories[0].name,
      list: [getSlideBrand_1(), getSlideBrand_3(), getSlideBrand_4()],
      onPressSeeAll: () => onPressSeeAllCallback,
      onPressItem: () => onPressItemCallback
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<BrandCategory {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should press see all button', () => {
    const { getByTestId } = renderWithGlobalContext(<BrandCategory {...props} />);
    fireEvent.press(getByTestId('category-brand-see-all-btn'));
    expect(onPressSeeAllCallback).toBeCalled();
  });

  it('should press a medium card item', () => {
    const { getAllByTestId } = renderWithGlobalContext(<BrandCategory {...props} />);
    fireEvent.press(getAllByTestId('medium-category-card-container')[0]);
    expect(onPressItemCallback).toBeCalled();
  });

  it('should press a fallback item', () => {
    const { getAllByTestId } = renderWithGlobalContext(<BrandCategory {...props} />);
    fireEvent.press(getAllByTestId('brand-category-item-fallback-card')[0]);
  });
});

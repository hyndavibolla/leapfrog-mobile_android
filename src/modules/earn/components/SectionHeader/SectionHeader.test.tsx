import React from 'react';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import SectionHeader, { Props } from './SectionHeader';

describe('SectionHeader', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      title: 'this is a title',
      shouldShowSeeAll: true,
      seeAllProps: { onPress: jest.fn() }
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<SectionHeader {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

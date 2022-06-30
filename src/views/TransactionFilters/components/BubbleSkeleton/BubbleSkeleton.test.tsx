import React from 'react';

import BubbleSkeleton from './BubbleSkeleton';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

describe('BubbleSkeleton', () => {
  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<BubbleSkeleton />);
    expect(toJSON()).toMatchSnapshot();
  });
});

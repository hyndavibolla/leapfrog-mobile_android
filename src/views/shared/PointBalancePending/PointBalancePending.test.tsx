import React from 'react';

import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { PointBalancePending } from '../PointBalancePending';

describe('PointBalancePending', () => {
  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<PointBalancePending />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with chevron', () => {
    const { toJSON } = renderWithGlobalContext(<PointBalancePending onPress={() => null} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

import React from 'react';

import HowItWorksPoints from './HowItWorksPoints';
import { renderWithGlobalContext } from '../../test-utils/renderWithGlobalContext';
import { Deps } from '../../models/general';
import { getMockDeps } from '../../test-utils/getMockDeps';

describe('HowItWorksPoints', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<HowItWorksPoints />, deps);
    expect(toJSON()).toMatchSnapshot();
  });
});

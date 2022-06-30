import React from 'react';

import { ICON } from '_constants/icons';
import { Deps } from '_models/general';

import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import PointPill, { Props } from './PointPill';

describe('PointPill', () => {
  let props: Props;
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
    props = {
      points: 1000,
      icon: ICON.SYW_CIRCLE
    };
  });

  it('should render Default PointPill', () => {
    const { queryByTestId } = renderWithGlobalContext(<PointPill {...props} />, deps);
    expect(queryByTestId('point-pill-body')).toBeTruthy();
    expect(queryByTestId('point-pill-icon')).toBeTruthy();
  });
});

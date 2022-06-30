import React from 'react';

import { Deps } from '_models/general';

import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import EmptyBarCode from './EmptyBarCode';

describe('EmptyBarCode', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should render', () => {
    const { getByTestId } = renderWithGlobalContext(<EmptyBarCode />, deps);
    expect(getByTestId('empty-bar-code-body')).toBeTruthy();
  });
});

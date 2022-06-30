import React from 'react';

import { Deps } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import BannerApplyForCardWithDescription from './BannerApplyForCardWithDescription';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('BannerApplyForCardWithDescription', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should render correctly', () => {
    const { getByTestId } = renderWithGlobalContext(<BannerApplyForCardWithDescription />, deps);
    expect(getByTestId('banner-apply-card-container')).toBeTruthy();
  });
});

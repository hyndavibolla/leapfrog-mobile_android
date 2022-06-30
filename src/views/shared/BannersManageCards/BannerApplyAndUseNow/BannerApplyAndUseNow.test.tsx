import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { Deps } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { ROUTES } from '_constants';

import BannerApplyAndUseNow from './BannerApplyAndUseNow';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('BannerApplyAndUseNow', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });
  it('should render the component correctly', () => {
    const { getByTestId } = renderWithGlobalContext(<BannerApplyAndUseNow />, deps);
    expect(getByTestId('banner-apply-and-use-container')).toBeTruthy();
  });

  it('should navigate to common webview', () => {
    const { getByTestId } = renderWithGlobalContext(<BannerApplyAndUseNow />, deps);
    fireEvent.press(getByTestId('banner-apply-and-use-text-button'));
    expect(mockNavigate).toBeCalledWith(ROUTES.COMMON_WEB_VIEW.MAIN, expect.any(Object));
  });

  it('should navigate to fusion webview', () => {
    const { getByTestId } = renderWithGlobalContext(<BannerApplyAndUseNow />, deps);
    fireEvent.press(getByTestId('banner-apply-and-use-apply-button'));
    expect(mockNavigate).toBeCalledWith(ROUTES.FUSION_VIEWER, expect.any(Object));
  });
});

import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { ROUTES } from '_constants';
import { Deps } from '_models/general';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';

import ClaimYourRewards from './ClaimYourRewards';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: mockNavigate })
}));

describe('ClaimYourRewards', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should render', () => {
    const { toJSON, getByTestId } = renderWithGlobalContext(<ClaimYourRewards />, deps);
    expect(getByTestId('earn-main-claim-your-rewards-header')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('on gift cards click navigate to rewards screen', () => {
    const { queryAllByTestId } = renderWithGlobalContext(<ClaimYourRewards />, deps);
    fireEvent.press(queryAllByTestId('large-content-card-container')[0]);
    expect(mockNavigate).toBeCalledWith(ROUTES.MAIN_TAB.REWARDS);
  });

  it('on Redeem on SYW click should navigate to SYW webview', () => {
    const { queryAllByTestId } = renderWithGlobalContext(<ClaimYourRewards />, deps);
    fireEvent.press(queryAllByTestId('large-content-card-container')[1]);
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith('https://www.shopyourway.com/redeempoints');
  });

  it('on Redeem on Redeem at Sears should navigate to Sears webview', () => {
    const { queryAllByTestId } = renderWithGlobalContext(<ClaimYourRewards />, deps);
    fireEvent.press(queryAllByTestId('large-content-card-container')[2]);
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith('https://m.sears.com/');
  });

  it('on Redeem on Redeem at Kmart should navigate to Kmart webview', () => {
    const { queryAllByTestId } = renderWithGlobalContext(<ClaimYourRewards />, deps);
    fireEvent.press(queryAllByTestId('large-content-card-container')[3]);
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith('https://m.kmart.com/');
  });
});

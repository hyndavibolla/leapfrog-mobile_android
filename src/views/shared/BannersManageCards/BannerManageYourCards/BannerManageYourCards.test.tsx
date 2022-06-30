import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';

import { BannerManageYourCards } from '.';

import { ROUTES } from '../../../../constants';
import { wait } from '../../../../utils/wait';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('BannerManageYourCards', () => {
  it('should render the component correctly', async () => {
    const { toJSON } = render(<BannerManageYourCards />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should navigate to CardLink webview when there are linked cards', async () => {
    const { getByTestId } = render(<BannerManageYourCards />);
    await act(() => wait(0));
    fireEvent.press(getByTestId('banner-manage-your-card-container'));
    expect(mockNavigate).toBeCalledWith(ROUTES.MAIN_TAB.WALLET);
  });
});

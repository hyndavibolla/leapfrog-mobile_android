import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { ROUTES } from '_constants/routes';
import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import AppOnboarding, { Props } from './AppOnboarding';

const mockedNavigate = jest.fn();

describe('App Onboarding', () => {
  let deps: Deps;
  let props: Props;
  let initState: IGlobalState;
  let width;

  beforeEach(() => {
    props = {
      navigation: { navigate: mockedNavigate } as any
    };

    initState = getInitialState();
    deps = getMockDeps();
    width = getMockDeps().nativeHelperService.dimensions.getWindowWidth();
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<AppOnboarding {...props} />, deps, initState);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should go to main when skip was pressed', async () => {
    initState.user.currentUser.personal.sywMemberNumber = 'abc123';

    const { getByTestId } = renderWithGlobalContext(<AppOnboarding {...props} />, deps, initState);

    fireEvent.press(getByTestId('onboarding-skip-btn'));
    await waitFor(() => {
      expect(mockedNavigate).toBeCalledWith(ROUTES.MAIN);
    });
  });

  it('should go to login when skip was pressed', async () => {
    initState.user.currentUser.personal.sywMemberNumber = '';

    const { getByTestId } = renderWithGlobalContext(<AppOnboarding {...props} />, deps, initState);

    fireEvent.press(getByTestId('onboarding-skip-btn'));
    await waitFor(() => {
      expect(mockedNavigate).toBeCalledWith(ROUTES.LOGIN);
    });
  });

  it('should go to Main when next button was pressed', async () => {
    initState.user.currentUser.personal.sywMemberNumber = 'abc123';

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<AppOnboarding {...props} />, deps, initState);

    fireEvent.scroll(getByTestId('onboarding-scrollView'), {
      nativeEvent: {
        contentOffset: {
          x: width * 2
        }
      }
    });
    fireEvent.press(getByTestId('onboarding-next-btn'));

    await waitFor(() => {
      expect(queryByTestId('onboarding-step-1-active')).toBeNull();
      expect(getByTestId('onboarding-step-2-active')).toBeTruthy();
      expect(queryByTestId('onboarding-skip-btn')).toBeNull();
      expect(mockedNavigate).toBeCalledWith(ROUTES.MAIN);
    });
  });

  it('should go to login  when next button was pressed', async () => {
    initState.user.currentUser.personal.sywMemberNumber = '';

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<AppOnboarding {...props} />, getMockDeps(), initState);

    fireEvent.scroll(getByTestId('onboarding-scrollView'), {
      nativeEvent: {
        contentOffset: {
          x: 0
        }
      }
    });
    fireEvent.press(getByTestId('onboarding-next-btn'));

    expect(queryByTestId('onboarding-step-0-active')).toBeTruthy();

    fireEvent.scroll(getByTestId('onboarding-scrollView'), {
      nativeEvent: {
        contentOffset: {
          x: width * 2
        }
      }
    });
    fireEvent.press(getByTestId('onboarding-next-btn'));

    await waitFor(() => {
      expect(queryByTestId('onboarding-step-1-active')).toBeNull();
      expect(getByTestId('onboarding-step-2-active')).toBeTruthy();
      expect(queryByTestId('onboarding-skip-btn')).toBeNull();
      expect(mockedNavigate).toBeCalledWith(ROUTES.LOGIN);
    });
  });
});

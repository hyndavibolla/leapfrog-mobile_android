import React from 'react';
import moment from 'moment';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';
import { ENV } from '_constants';

import { TutorialReminderModal } from './TutorialReminderModal';

describe('TutorialReminderModal', () => {
  let initialState: IGlobalState;
  let deps: Deps;
  let date: string;
  let props;
  let render;
  const newStatus = {
    isBannerWatched: true,
    date: undefined
  };

  beforeEach(() => {
    date = moment().subtract(8, 'days').toString();
    initialState = getInitialState();
    deps = getMockDeps();

    initialState.core.isTutorialAvailable = true;

    const { Screen, Navigator } = createStackNavigator();
    render = (p, d, s) => {
      const Component = () => <TutorialReminderModal {...props} {...(p || {})} />;
      return renderWithGlobalContext(
        <NavigationContainer>
          <Navigator>
            <Screen name="route" component={Component} />
          </Navigator>
        </NavigationContainer>,
        d,
        s
      );
    };
  });

  it('should not show the modal when isTutorialAvailable is false', async () => {
    initialState.core.isTutorialAvailable = false;
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce({ isBannerWatched: true, date });
    const { queryByTestId } = render(props, deps, initialState);
    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(1, ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS);

    await waitFor(() => {
      expect(queryByTestId('tutorial-reminder-modal-content')).toBeNull();
    });
  });

  it('should not show the modal when days are less than 8', async () => {
    date = moment().subtract(1, 'days').toString();
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce({ isBannerWatched: true, date });
    const { queryByTestId } = render(props, deps, initialState);
    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(1, ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS);

    await waitFor(() => {
      expect(queryByTestId('tutorial-reminder-modal-content')).toBeNull();
    });
  });

  it('should show the modal and close when press confirm button', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce({ isBannerWatched: true, date });
    const { getByTestId, queryByTestId } = render(props, deps, initialState);
    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(1, ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS);

    await waitFor(async () => {
      expect(getByTestId('tutorial-reminder-modal-content')).toBeTruthy();
      fireEvent.press(getByTestId('tutorial-reminder-modal-confirm-button'));
    });
    expect(deps.nativeHelperService.storage.set).toHaveBeenCalledWith(ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS, newStatus);
    expect(queryByTestId('tutorial-reminder-modal-content')).toBeNull();
  });

  it('should close the modal when press cancel button', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce({ isBannerWatched: true, date });
    const { getByTestId, queryByTestId } = render(props, deps, initialState);
    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(1, ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS);

    await waitFor(() => {
      expect(getByTestId('tutorial-reminder-modal-content')).toBeTruthy();
      fireEvent.press(getByTestId('tutorial-reminder-modal-cancel-button'));
    });
    expect(deps.nativeHelperService.storage.set).toHaveBeenCalledWith(ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS, newStatus);
    expect(queryByTestId('tutorial-reminder-modal-content')).toBeNull();
  });

  it('should close the modal when press outside', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValueOnce({ isBannerWatched: true, date });
    const { getByTestId, queryByTestId } = render(props, deps, initialState);
    expect(deps.nativeHelperService.storage.get).toHaveBeenNthCalledWith(1, ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS);

    await waitFor(() => {
      expect(getByTestId('tutorial-reminder-modal-content')).toBeTruthy();
      fireEvent.press(getByTestId('modal-backdrop'));
    });
    expect(deps.nativeHelperService.storage.set).toHaveBeenCalledWith(ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS, newStatus);
    expect(queryByTestId('tutorial-reminder-modal-content')).toBeNull();
  });
});

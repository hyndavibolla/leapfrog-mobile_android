import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';

import MapCard, { Props } from './MapCard';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getUser } from '_test_utils/entities';
import { wait } from '_utils/wait';

describe('MapCard', () => {
  let props: Props;
  let initialState: IGlobalState;

  beforeEach(() => {
    props = {
      isLocationEnabled: false,
      isLocationPermissionBlocked: false,
      onPressEnabledButton: jest.fn(),
      onPressExploreButton: jest.fn()
    };
    initialState = getInitialState();
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<MapCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with isLocationEnabled', () => {
    props.isLocationEnabled = true;
    const { toJSON } = renderWithGlobalContext(<MapCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable EnabledButton', () => {
    props.isLocationEnabled = true;
    const { getByTestId } = renderWithGlobalContext(<MapCard {...props} />);
    fireEvent.press(getByTestId('map-card-button'));
    expect(props.onPressExploreButton).toBeCalled();
  });

  it('should be pressable ExploreButton', () => {
    const { getByTestId } = renderWithGlobalContext(<MapCard {...props} />);
    fireEvent.press(getByTestId('map-card-button'));
    expect(props.onPressEnabledButton).toBeCalled();
  });

  it('should show Edit button zip code', async () => {
    props.isLocationPermissionBlocked = true;
    const state = {
      ...initialState,
      user: {
        currentUser: getUser()
      }
    } as IGlobalState;

    const { queryByTestId } = renderWithGlobalContext(<MapCard {...props} />, undefined, state);
    await act(() => wait(0));
    expect(queryByTestId('map-card-button-edit-zip-code')).toBeTruthy();
  });

  it('should no show Edit button zip code and no show Field zip code component', async () => {
    props.isLocationPermissionBlocked = true;
    const state = {
      ...initialState,
      user: {
        currentUser: {
          ...getUser(),
          personal: {
            ...getUser().personal,
            currentLocation: {
              zip: null,
              latitude: null,
              longitude: null
            }
          }
        }
      }
    } as IGlobalState;

    const { queryByTestId } = renderWithGlobalContext(<MapCard {...props} />, undefined, state);
    await act(() => wait(0));
    expect(queryByTestId('map-card-button-edit-zip-code')).toBeFalsy();
    expect(queryByTestId('map-card-button')).toBeFalsy();
  });

  it('should be show and call Edit button zip code', async () => {
    const state = {
      ...initialState,
      user: {
        currentUser: getUser()
      }
    } as IGlobalState;

    const { queryByTestId } = renderWithGlobalContext(<MapCard {...props} />, undefined, state);
    await act(() => wait(0));
    expect(queryByTestId('map-card-button-edit-zip-code')).toBeTruthy();
    await act(() => wait(0));
    fireEvent.press(queryByTestId('map-card-button-edit-zip-code'));
  });
});

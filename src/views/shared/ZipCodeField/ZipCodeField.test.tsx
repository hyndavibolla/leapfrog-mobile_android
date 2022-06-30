import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { Deps, IGlobalState } from '_models/general';
import { getGeocodeAddress } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';

import ZipCodeField, { ZipCodeStatusMessage, Props } from './ZipCodeField';
import { getInitialState } from '_state_mgmt/GlobalState';

describe('ZipCodeField component', () => {
  let deps: Deps;
  let props: Props;
  let initialState: IGlobalState;

  beforeEach(() => {
    deps = getMockDeps();
    initialState = getInitialState();
    props = {
      onEditing: jest.fn()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<ZipCodeField {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should change input Text and set EMPTY message', async () => {
    const { queryByTestId } = renderWithGlobalContext(<ZipCodeField {...props} />);
    fireEvent.press(queryByTestId('zip-code-button-add-zip-code'));
    await act(() => wait(0));
    fireEvent.changeText(queryByTestId('zip-code-field'), '90011');
    await act(() => wait(0));
    fireEvent.changeText(queryByTestId('zip-code-field'), '');
    await act(() => wait(0));
    expect(queryByTestId('zip-code-text-message').props.children).toEqual(ZipCodeStatusMessage.EMPTY);
  });

  it('should change input Text and set ONLY_NUMBERS message', async () => {
    const { queryByTestId } = renderWithGlobalContext(<ZipCodeField {...props} />);
    fireEvent.press(queryByTestId('zip-code-button-add-zip-code'));
    await act(() => wait(0));
    fireEvent.changeText(queryByTestId('zip-code-field'), '9001A');
    await act(() => wait(0));
    expect(queryByTestId('zip-code-text-message').props.children).toEqual(ZipCodeStatusMessage.ONLY_NUMBERS);
  });

  it('should change input Text and set MAX_LENGTH message', async () => {
    const { queryByTestId } = renderWithGlobalContext(<ZipCodeField {...props} />);
    fireEvent.press(queryByTestId('zip-code-button-add-zip-code'));
    await act(() => wait(0));
    fireEvent.changeText(queryByTestId('zip-code-field'), '9001');
    await act(() => wait(0));
    expect(queryByTestId('zip-code-text-message').props.children).toEqual(ZipCodeStatusMessage.MAX_LENGTH);
  });

  it('should change input Text and set VALID message', async () => {
    const { queryByTestId } = renderWithGlobalContext(<ZipCodeField {...props} />);
    fireEvent.press(queryByTestId('zip-code-button-add-zip-code'));
    await act(() => wait(0));
    fireEvent.changeText(queryByTestId('zip-code-field'), '90011');
    await act(() => wait(0));
    expect(queryByTestId('zip-code-text-message').props.children).toEqual(ZipCodeStatusMessage.VALID);
  });

  it('should render loading components', async () => {
    const { queryByTestId } = renderWithGlobalContext(<ZipCodeField {...props} />);
    fireEvent.press(queryByTestId('zip-code-button-add-zip-code'));
    await act(() => wait(0));
    fireEvent.changeText(queryByTestId('zip-code-field'), '90011');
    await act(() => wait(0));
    fireEvent.press(queryByTestId('zip-code-arrow-right-icon'));
    expect(queryByTestId('zip-code-lottie')).toBeTruthy();
    expect(queryByTestId('zip-code-text-loading')).toBeTruthy();
    await act(() => wait(0));
  });

  it('should no render loading components and set MAX_LENGTH message', async () => {
    const { queryByTestId } = renderWithGlobalContext(<ZipCodeField {...props} />);
    fireEvent.press(queryByTestId('zip-code-button-add-zip-code'));
    await act(() => wait(0));
    fireEvent.changeText(queryByTestId('zip-code-field'), '9001');
    await act(() => wait(0));
    fireEvent.press(queryByTestId('zip-code-arrow-right-icon'));
    expect(queryByTestId('zip-code-lottie')).toBeFalsy();
    expect(queryByTestId('zip-code-text-loading')).toBeFalsy();
    expect(queryByTestId('zip-code-text-message').props.children).toEqual(ZipCodeStatusMessage.MAX_LENGTH);
    await act(() => wait(0));
  });

  it('should render toast components', async () => {
    deps.apiService.geocodeAddress = jest.fn().mockResolvedValue([getGeocodeAddress()]);
    const { queryByTestId } = renderWithGlobalContext(<ZipCodeField {...props} />, deps);
    fireEvent.press(queryByTestId('zip-code-button-add-zip-code'));
    await act(() => wait(0));
    fireEvent.changeText(queryByTestId('zip-code-field'), '90011');
    await act(() => wait(0));
    act(() => {
      fireEvent.press(queryByTestId('zip-code-arrow-right-icon'));
    });
    await act(() => wait(0));
    expect(queryByTestId('zip-code-toast')).toBeTruthy();
    /** This 2200 ms is to avoid the warning that a setState was executed when the component is not mounted because there is a setTimeOut that is triggered after 2000 ms   */
    await act(() => wait(2200));
  });

  it('should show invalid message', async () => {
    deps.apiService.geocodeAddress = jest.fn().mockResolvedValue([]);
    const { queryByTestId } = renderWithGlobalContext(<ZipCodeField {...props} />, deps);
    fireEvent.press(queryByTestId('zip-code-button-add-zip-code'));
    await act(() => wait(0));
    fireEvent.changeText(queryByTestId('zip-code-field'), '00000');
    await act(() => wait(0));
    act(() => {
      fireEvent.press(queryByTestId('zip-code-arrow-right-icon'));
    });
    await act(() => wait(0));
    expect(queryByTestId('zip-code-text-message').props.children).toEqual(ZipCodeStatusMessage.INVALID);
    expect(queryByTestId('zip-code-field').props.value).toEqual('');
    await act(() => wait(0));
  });

  it('should load stored currentLocation when it has at least one null value', async () => {
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue({ zip: '90011', latitude: 2, longitude: 2 });
    initialState.user.currentUser.personal.currentLocation.zip = null;

    renderWithGlobalContext(<ZipCodeField {...props} />, deps, initialState);

    await waitFor(() => expect(deps.nativeHelperService.storage.get).toHaveBeenCalled());
  });

  it('should use zip code to get geo code address', async () => {
    jest.useFakeTimers('legacy');
    const zipCode = '90011';
    deps.nativeHelperService.storage.set = jest.fn();
    deps.apiService.geocodeAddress = jest.fn();

    const { getByTestId } = renderWithGlobalContext(<ZipCodeField {...props} />, deps);

    fireEvent.press(getByTestId('zip-code-button-add-zip-code'));
    fireEvent.changeText(getByTestId('zip-code-field'), zipCode);
    fireEvent.press(getByTestId('zip-code-arrow-right-icon'));

    await waitFor(() => expect(deps.apiService.geocodeAddress).toHaveBeenCalledWith(zipCode));
    act(() => jest.advanceTimersByTime(2000));
  });

  it('should store currentLocation', async () => {
    jest.useFakeTimers('legacy');
    deps.nativeHelperService.storage.set = jest.fn();
    deps.apiService.geocodeAddress = jest.fn().mockResolvedValue([getGeocodeAddress()]);

    const { getByTestId, mockReducer } = renderWithGlobalContext(<ZipCodeField {...props} />, deps);

    fireEvent.press(getByTestId('zip-code-button-add-zip-code'));
    fireEvent.changeText(getByTestId('zip-code-field'), '90011');
    fireEvent.press(getByTestId('zip-code-arrow-right-icon'));
    await waitFor(() => {
      expect(deps.nativeHelperService.storage.set).toBeCalled();
    });
    act(() => jest.advanceTimersByTime(2000));
    expect(mockReducer).toBeCalled();
  });
});

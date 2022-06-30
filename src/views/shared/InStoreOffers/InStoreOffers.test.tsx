import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import navigation from '@react-navigation/native';

import InStoreOffers from './InStoreOffers';

import { Deps, IGlobalState } from '../../../models/general';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { getMockDeps } from '../../../test-utils/getMockDeps';
import { getLocalOffers_2 } from '../../../test-utils/entities';
import { wait } from '../../../utils/wait';

import { getInitialState } from '../../../state-mgmt/GlobalState';

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate
  })
}));

const position = {
  coords: {
    latitude: 57.7,
    longitude: 11.93
  }
};

describe('In Store Offers', () => {
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    navigation.useIsFocused = jest.fn(() => true);
    deps = getMockDeps();
    initialState = getInitialState();
  });

  it('should render', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_2()) as any;

    const { toJSON } = renderWithGlobalContext(<InStoreOffers />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not fetch offers when the component is not focused', async () => {
    navigation.useIsFocused = jest.fn(() => false);
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_2()) as any;
    renderWithGlobalContext(<InStoreOffers />, deps);
    await act(() => wait(0));
    expect(deps.apiService.fetchLocalOffers).not.toBeCalled();
  });

  it('should navigate to details', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_2()) as any;
    const { getAllByTestId } = renderWithGlobalContext(<InStoreOffers />, deps);
    await act(() => wait(0));
    fireEvent.press(await getAllByTestId('in-store-offer-container')[0]);
    expect(mockNavigate).toBeCalled();
  });

  it("should render when the user's location could not be obtained", async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce((successCallback, errorCallback) => {
      errorCallback(new Error(''));
    });
    const { getByTestId } = renderWithGlobalContext(<InStoreOffers />, deps);
    await act(() => wait(0));
    expect(getByTestId('empty-state-card')).toBeTruthy();
  });

  it('should render when the in-store offers obtained is equal to zero', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue({
      userId: '123',
      offers: []
    }) as any;

    const { getByTestId } = renderWithGlobalContext(<InStoreOffers />, deps);
    await act(() => wait(0));
    expect(getByTestId('empty-state-card')).toBeTruthy();
  });

  it('should navigate to offer details', async () => {
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_2()) as any;

    const { getAllByTestId } = renderWithGlobalContext(<InStoreOffers />, deps);
    await act(() => wait(0));
    fireEvent(getAllByTestId('in-store-offer-item')[0], 'onPress', { stopPropagation: jest.fn() });
    await act(() => wait(0));
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('should fetch offers if the zip code is provided', async () => {
    initialState.user.currentUser.personal.currentLocation = { zip: 33101, latitude: position.coords.latitude, longitude: position.coords.longitude };
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_2()) as any;

    const { getByTestId } = renderWithGlobalContext(<InStoreOffers />, deps, initialState);

    await act(() => wait(0));
    expect(getByTestId('in-store-offers-container')).toBeTruthy();
  });

  it('should does not fetch offers if the zip code is provided', async () => {
    initialState.user.currentUser.personal.currentLocation = { zip: 33101, latitude: position.coords.latitude, longitude: position.coords.longitude };
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_2()) as any;

    const { getByTestId } = renderWithGlobalContext(<InStoreOffers />, deps, initialState);

    await act(() => wait(0));
    expect(getByTestId('in-store-offers-container')).toBeTruthy();
  });
});

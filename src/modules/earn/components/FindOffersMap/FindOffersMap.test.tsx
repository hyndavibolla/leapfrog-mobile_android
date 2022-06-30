import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
const { RESULTS } = require('react-native-permissions/mock');

import FindOffersMap from './FindOffersMap';

import { Deps } from '_models/general';
import { getLinkedCards_2, getLocalOffers_1 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';

import { ROUTES } from '_constants';

const mockNavigate = jest.fn();
const mockPush = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    push: mockPush
  }),
  useIsFocused: jest.fn(() => true)
}));

describe('FindOffersMap', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should render', async () => {
    const { getByTestId } = renderWithGlobalContext(<FindOffersMap />, deps);
    await waitFor(() => {
      expect(getByTestId('earn-main-find-offers-map-section-container')).toBeTruthy();
    });
  });

  it('should go to the Map Section when location permission is granted and map card button was pressed', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(RESULTS.GRANTED);

    const { findByTestId } = renderWithGlobalContext(<FindOffersMap />, deps);

    fireEvent.press(await findByTestId('map-card-button'));
    expect(mockPush).toBeCalledWith(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP);
  });

  it('should navigate to CardLink webview', async () => {
    deps.apiService.fetchLinkedCardsList = jest.fn().mockResolvedValue({ linkedCards: [getLinkedCards_2()] });
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(RESULTS.GRANTED);
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;

    const { findByTestId } = renderWithGlobalContext(<FindOffersMap />, deps);

    fireEvent.press(await findByTestId('banner-add-cards-add-another-card'));
    expect(mockNavigate).toBeCalledWith(ROUTES.IN_STORE_OFFERS.CARD_LINK);
  });
});

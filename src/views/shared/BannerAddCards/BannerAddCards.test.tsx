import React from 'react';
import { BannerAddCards, Props } from './BannerAddCards';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { Deps, IGlobalState } from '_models/general';

import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { ROUTES } from '_constants';
import { getLinkedCards_2 } from '_test_utils/entities';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: mockedNavigate }), useIsFocused: jest.fn(() => true) }));

describe('BannerAddCards', () => {
  let state: IGlobalState;
  let deps: Deps;
  let props: Props;

  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
    props = {
      shouldShowOffers: false,
      onShowOffersPressed: jest.fn(),
      onPressAddCardButton: jest.fn()
    };
  });

  it('should render loading', async () => {
    const { findByTestId } = renderWithGlobalContext(<BannerAddCards {...props} />, deps, state);
    expect(await findByTestId('loading-container')).toBeTruthy();
  });

  it('should render empty container banner', async () => {
    deps.apiService.fetchLinkedCardsList = () => Promise.reject('error');
    const { findByTestId } = renderWithGlobalContext(<BannerAddCards {...props} />, deps, state);
    expect(await findByTestId('banner-add-cards-empty-container')).toBeTruthy();
  });

  it('should render linked cards container banner', async () => {
    state.cardLink.linkedCardsList = [getLinkedCards_2()];
    const { getByTestId } = renderWithGlobalContext(<BannerAddCards {...props} />, deps, state, () => state);
    await waitFor(() => {
      expect(getByTestId('banner-add-cards-button-show-offers')).toBeTruthy();
      expect(getByTestId('banner-add-cards-linked-cards-container')).toBeTruthy();
    });
  });

  it('should render linked cards container banner and call show offers button', async () => {
    state.cardLink.linkedCardsList = [getLinkedCards_2()];
    const { findByTestId } = renderWithGlobalContext(<BannerAddCards {...props} />, deps, state, () => state);
    fireEvent.press(await findByTestId('banner-add-cards-button-show-offers'));
    expect(props.onShowOffersPressed).toHaveBeenCalled();
  });

  it('should render add card banner ', async () => {
    state.cardLink.linkedCardsList = [];
    const { findByTestId } = renderWithGlobalContext(<BannerAddCards {...props} />, deps, state, () => state);
    expect(await findByTestId('banner-add-new-card-container')).toBeTruthy();
  });

  it('should navigate to CardLink webview', async () => {
    state.cardLink.linkedCardsList = [];
    const { findByTestId } = renderWithGlobalContext(<BannerAddCards {...props} />, deps, state, () => state);
    fireEvent.press(await findByTestId('banner-add-new-card-container'));
    expect(mockedNavigate).toBeCalledWith(ROUTES.IN_STORE_OFFERS.CARD_LINK);
  });
});

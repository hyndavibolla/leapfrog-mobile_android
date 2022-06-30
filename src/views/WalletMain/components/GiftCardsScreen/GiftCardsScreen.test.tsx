import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { GiftCardsScreen, Props } from './GiftCardsScreen';

import { getInitialState } from '_state_mgmt/GlobalState';
import { Deps, IGlobalState, FeatureFlag } from '_models/general';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';
import { getGiftCard } from '_test_utils/entities';
import { ROUTES, ENV } from '_constants';
import { statusType } from '_models/giftCard';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  }),
  useIsFocused: jest.fn(() => true)
}));
describe('Gift Cards Screen', () => {
  let state: IGlobalState;
  let deps: Deps;
  let props: Props;

  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
    props = {
      giftCardsList: [getGiftCard()]
    };
    ENV.IGNORED_FEATURE_LIST.splice(ENV.IGNORED_FEATURE_LIST.indexOf(FeatureFlag.WALLET_YOUR_GC), 1);
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<GiftCardsScreen {...props} />, deps, state);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render empty state if giftcardList is empty', () => {
    props.giftCardsList = [];
    const { getByTestId } = renderWithGlobalContext(<GiftCardsScreen {...props} />, deps, state);
    expect(getByTestId('gift-cards-screen-empty-state-container')).toBeTruthy();
  });

  it('should navigate to rewards when the user tap explore gift cards', () => {
    props.giftCardsListError = true;

    const { getByTestId } = renderWithGlobalContext(<GiftCardsScreen {...props} />, deps, state);
    fireEvent.press(getByTestId('gift-cards-screen-explore-gift-card'));
    expect(mockNavigate).toBeCalledWith(ROUTES.MAIN_TAB.REWARDS);
  });

  it('should navigate to rewards when the user tap buy gift card', () => {
    const { getByTestId } = renderWithGlobalContext(<GiftCardsScreen {...props} />, deps, state);

    fireEvent.press(getByTestId('gift-cards-screen-buy-gift-card'));
    expect(mockNavigate).toBeCalledWith(ROUTES.MAIN_TAB.REWARDS);
  });

  it('should navigate to the gift card detail (android) ', () => {
    deps.nativeHelperService.platform.OS = 'android';
    const {
      providerCardId,
      cardBalance,
      statusInd,
      cardProvider,
      brandDetails: { brandName }
    } = getGiftCard();
    const { getAllByTestId } = renderWithGlobalContext(<GiftCardsScreen {...props} />, deps, state);

    fireEvent.press(getAllByTestId('gift-card-container')[0]);
    expect(mockNavigate).toBeCalledWith(ROUTES.GIFT_CARD_LIST_DETAIL, {
      giftCardId: providerCardId,
      title: brandName,
      cardBalance,
      statusInd,
      cardProvider
    });
  });

  it('should navigate to your gift cards if user taps on see all', () => {
    const { getByTestId } = renderWithGlobalContext(<GiftCardsScreen {...props} />, deps, state);

    fireEvent.press(getByTestId('gift-cards-screen-see-all'));
    expect(mockNavigate).toBeCalledWith(ROUTES.WALLET_YOUR_GIFT_CARDS.MAIN, { showYourGiftCards: true });
  });

  it('should navigate to your archived gift cards if user taps on see all an has zero active gift cards', () => {
    props.giftCardsList = [{ ...getGiftCard(), statusInd: statusType.HIDDEN }];
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<GiftCardsScreen {...props} />, deps, state);

    expect(queryByTestId('gift-cards-screen-empty-state-container')).toBeTruthy();
    fireEvent.press(getByTestId('gift-cards-screen-see-all'));
    expect(mockNavigate).toBeCalledWith(ROUTES.WALLET_YOUR_GIFT_CARDS.MAIN, { showYourGiftCards: false });
  });

  it('should render all the cards', () => {
    const { getAllByTestId } = renderWithGlobalContext(<GiftCardsScreen {...props} />, deps, state);
    expect(getAllByTestId('gift-card-container').length).toBe(1);
  });

  it('should go to gift card detail if GC is pressed', () => {
    deps.nativeHelperService.platform.OS = 'ios';
    const {
      providerCardId,
      cardBalance,
      statusInd,
      cardProvider,
      brandDetails: { brandName }
    } = getGiftCard();
    const { getAllByTestId } = renderWithGlobalContext(<GiftCardsScreen {...props} />, deps, state);
    fireEvent.press(getAllByTestId('gift-card-container')[0]);
    expect(mockNavigate).toBeCalledWith(ROUTES.GIFT_CARD_LIST_DETAIL, {
      giftCardId: providerCardId,
      title: brandName,
      cardBalance,
      statusInd,
      cardProvider
    });
  });

  it('should action a long press (android)', () => {
    deps.nativeHelperService.platform.OS = 'android';
    const { getAllByTestId, getByTestId } = renderWithGlobalContext(<GiftCardsScreen {...props} />, deps, state);
    fireEvent(getAllByTestId('gift-card-container')[0], 'longPress');
    expect(getByTestId('archive-confirmation-modal-content')).toBeTruthy();
  });

  it('should dismiss modal with cancel button', () => {
    deps.nativeHelperService.platform.OS = 'ios';

    const { getAllByTestId, getByTestId, queryByTestId } = renderWithGlobalContext(<GiftCardsScreen {...props} />, deps, state);
    fireEvent.press(getAllByTestId('swipe-item-right-button')[0]);
    expect(getByTestId('archive-confirmation-modal-content')).toBeTruthy();
    fireEvent.press(getByTestId('archive-confirmation-modal-cancel-button'));
    expect(queryByTestId('archive-confirmation-modal')).toBeNull();
  });

  it('should dismiss modal when press confirm button', async () => {
    deps.nativeHelperService.platform.OS = 'ios';

    const { getAllByTestId, getByTestId, queryByTestId } = renderWithGlobalContext(<GiftCardsScreen {...props} />, deps, state);
    fireEvent.press(getAllByTestId('swipe-item-right-button')[0]);
    expect(getByTestId('archive-confirmation-modal-content')).toBeTruthy();
    fireEvent.press(getByTestId('archive-confirmation-modal-confirm-button'));
    expect(deps.apiService.updateCardStatus).toBeCalledWith({
      id: getGiftCard().providerCardId,
      status: statusType.HIDDEN,
      cardProvider: getGiftCard().cardProvider
    });
    await waitFor(() => expect(queryByTestId('archive-confirmation-modal')).toBeNull());
  });
});

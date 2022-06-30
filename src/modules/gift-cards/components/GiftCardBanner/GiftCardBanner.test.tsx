import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { ROUTES } from '_constants/routes';

import { getGiftCard } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import GiftCardBanner, { Props } from './GiftCardBanner';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return { useNavigation: () => ({ navigate: mockedNavigate }) };
});

describe('GiftCardBanner', () => {
  let props: Props;
  const giftCards = [getGiftCard(), getGiftCard(), getGiftCard()];

  beforeEach(() => {
    props = {
      giftCards: giftCards.map((giftCard, index) => {
        giftCard.brandDetails.brandId = index.toString();
        return giftCard;
      })
    };
  });

  it('should render', () => {
    const { queryAllByTestId } = renderWithGlobalContext(<GiftCardBanner {...props} />);
    expect(queryAllByTestId('card-with-logos-item')).toHaveLength(3);
  });

  it('should navigate to gift cards screen', () => {
    const { getByTestId } = renderWithGlobalContext(<GiftCardBanner {...props} />);
    fireEvent.press(getByTestId('card-with-logos-pressable-container'));
    expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.WALLET_YOUR_GIFT_CARDS.MAIN, { showYourGiftCards: true });
  });
});

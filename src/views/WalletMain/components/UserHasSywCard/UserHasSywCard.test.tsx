import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { ROUTES } from '_constants/routes';
import { getMockDeps } from '_test_utils/getMockDeps';
import { Deps, IGlobalState } from '_models/general';
import { LinkedCardPartnerType } from '_models/cardLink';

import UserHasSywCard, { cardDetailTitle, Props } from './UserHasSywCard';
import { getInitialState } from '_state_mgmt/GlobalState';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('User Has Syw Card', () => {
  let deps: Deps;
  let initialState: IGlobalState;
  let props: Props;

  beforeEach(() => {
    deps = getMockDeps();
    initialState = getInitialState();
    props = {
      title: 'test',
      subtitle: 'test'
    };
  });

  it('should render', () => {
    const { getByTestId } = renderWithGlobalContext(<UserHasSywCard {...props} />);
    expect(getByTestId('user-has-syw-card-container')).toBeTruthy();
  });

  it('should navigate to SYW card details', () => {
    initialState.cardLink.linkedCardsList = [
      {
        cardId: '1234',
        cardLastFour: '5678',
        cardType: 'type',
        partnerType: LinkedCardPartnerType.MASTERCARD,
        tuId: '',
        isSywCard: true
      }
    ];
    const { getByTestId } = renderWithGlobalContext(<UserHasSywCard {...props} />, deps, initialState);
    fireEvent.press(getByTestId('user-has-syw-card-show-detail-btn'));
    expect(mockNavigate).toBeCalledWith(ROUTES.WALLET_DETAIL, {
      cardId: initialState.cardLink.linkedCardsList[0].cardId,
      cardLastFour: initialState.cardLink.linkedCardsList[0].cardLastFour,
      isSywCard: initialState.cardLink.linkedCardsList[0].isSywCard,
      isLinkedToCardlink: true,
      title: cardDetailTitle
    });
  });

  it('should navigate to SYW card details when card is unlinked', () => {
    initialState.cardLink.linkedCardsList = [];
    initialState.game.current.memberships.sywCardLastFour = '1234';
    const { getByTestId } = renderWithGlobalContext(<UserHasSywCard {...props} />, deps, initialState);
    fireEvent.press(getByTestId('user-has-syw-card-show-detail-btn'));
    expect(mockNavigate).toBeCalledWith(ROUTES.WALLET_DETAIL, {
      cardId: undefined,
      cardLastFour: '1234',
      isSywCard: true,
      isLinkedToCardlink: false,
      title: cardDetailTitle
    });
  });
});

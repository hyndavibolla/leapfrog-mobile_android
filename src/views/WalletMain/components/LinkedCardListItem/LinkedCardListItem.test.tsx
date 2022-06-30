import React from 'react';

import { Deps } from '_models/general';
import { act } from 'react-test-renderer';
import { wait } from '_utils/wait';

import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { LinkedCardListItem, Props } from './LinkedCardListItem';
import { fireEvent } from '@testing-library/react-native';
import { ROUTES } from '_constants';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: mockNavigate }) }));

describe('LinkedCardListItem', () => {
  let deps: Deps;
  let props: Props;

  beforeEach(() => {
    deps = getMockDeps();
    props = {
      cardId: '1234',
      cardLastFour: '5678',
      cardType: 'VISA',
      isSywCard: false,
      isLinkedToCardlink: true
    };
  });

  it('should render a regular card', async () => {
    const { toJSON } = renderWithGlobalContext(<LinkedCardListItem {...props} />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a SYW card', async () => {
    props.cardType = 'MSCR';
    props.isSywCard = true;
    const { toJSON } = renderWithGlobalContext(<LinkedCardListItem {...props} />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should navigate to regular card details', async () => {
    const { queryAllByTestId } = renderWithGlobalContext(<LinkedCardListItem {...props} />, deps);
    await act(() => wait(0));
    fireEvent.press(queryAllByTestId('item-container-card')[0]);
    expect(mockNavigate).toBeCalledWith(ROUTES.WALLET_DETAIL, {
      cardId: '1234',
      cardLastFour: '5678',
      isSywCard: false,
      isLinkedToCardlink: true,
      title: 'Visa'
    });
  });

  it('should navigate to SYW card details', async () => {
    props.cardType = 'MSCR';
    props.isSywCard = true;
    const { queryAllByTestId } = renderWithGlobalContext(<LinkedCardListItem {...props} />, deps);
    await act(() => wait(0));
    fireEvent.press(queryAllByTestId('item-container-card')[0]);
    expect(mockNavigate).toBeCalledWith(ROUTES.WALLET_DETAIL, {
      cardId: '1234',
      cardLastFour: '5678',
      isSywCard: true,
      isLinkedToCardlink: true,
      title: 'SHOP YOUR WAY MASTERCARD®'
    });
  });
});

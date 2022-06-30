import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import navigation from '@react-navigation/native';

import GiftCardSection, { Props } from './GiftCardSection';

import { getInitialState } from '_state_mgmt/GlobalState';
import { Deps, IGlobalState } from '_models/general';
import { TransactionFilter } from '_models/offer';

import { getSlideBrand_1 } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import { wait } from '_utils/wait';
import { ROUTES } from '_constants';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return { useNavigation: () => ({ navigate: mockedNavigate }) };
});

describe('Gift Card Section', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    navigation.useIsFocused = jest.fn(() => true);
    props = {
      transactionType: TransactionFilter.ALL_TRANSACTIONS
    };
    deps = getMockDeps();
    initialState = getInitialState();
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<GiftCardSection {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should navigate to gift card detail when the first gift card of the list is pressed', async () => {
    const { getAllByTestId } = renderWithGlobalContext(<GiftCardSection {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('gift-card-section-gift-card')[0]);
    await act(() => wait(0));
    expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.GIFT_CARD_DETAIL, { brandId: getSlideBrand_1().id });
  });

  it('should render nothing when giftCards list is empty', async () => {
    (deps.raiseService.fetchSlideBrand as jest.Mock).mockRejectedValueOnce('error');
    const { queryAllByTestId } = renderWithGlobalContext(<GiftCardSection {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(queryAllByTestId('gift-card-section-gift-card')[0]).toBeFalsy();
  });

  it('should not fetch gift cards when the component is not focused', async () => {
    navigation.useIsFocused = jest.fn(() => false);
    (deps.raiseService.fetchSlideBrand as jest.Mock).mockRejectedValueOnce('error');
    renderWithGlobalContext(<GiftCardSection {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(deps.raiseService.fetchSlideBrand).not.toBeCalled();
  });
});

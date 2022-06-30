import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import navigation from '@react-navigation/native';
const {
  RESULTS: { GRANTED, BLOCKED }
} = require('react-native-permissions/mock');

import { ROUTES } from '_constants';
import { Deps, IGlobalState } from '_models/general';
import { TransactionFilter } from '_models/offer';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';
import FallbackTransactions, { Props } from './FallbackTransactions';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return { useNavigation: () => ({ navigate: mockedNavigate }) };
});

const position = {
  coords: {
    latitude: 57.7,
    longitude: 11.93
  }
};

describe('Fallback Transactions', () => {
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
    const { toJSON } = renderWithGlobalContext(<FallbackTransactions {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render reward section', async () => {
    props.transactionType = TransactionFilter.REWARDS;

    const { queryAllByTestId } = renderWithGlobalContext(<FallbackTransactions {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(queryAllByTestId('gift-card-section-note')).toBeTruthy();
  });

  it('should render mission section', async () => {
    props.transactionType = TransactionFilter.MISSIONS;

    const { queryAllByTestId } = renderWithGlobalContext(<FallbackTransactions {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(queryAllByTestId('top-brands-section-note')).toBeTruthy();
  });

  it('should render mastercard section', async () => {
    props.transactionType = TransactionFilter.SYW_MASTERCARD;

    const { queryAllByTestId } = renderWithGlobalContext(<FallbackTransactions {...props} />, deps, initialState);
    await act(() => wait(0));
    expect(queryAllByTestId('top-brands-section-note')).toBeTruthy();
  });

  it('should navigate to in store offer search map when transaction type is local offer and location is available', async () => {
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(GRANTED);
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });

    props.transactionType = TransactionFilter.LOCAL_OFFERS;

    const { getByTestId } = renderWithGlobalContext(<FallbackTransactions {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId('fallback-transactions-button'));
    await act(() => wait(0));
    expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP);
  });

  it("should navigate to earn's in store offer search map when transaction type is local offer and location is unavailable", async () => {
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValue(BLOCKED);

    props.transactionType = TransactionFilter.LOCAL_OFFERS;

    const { getByTestId } = renderWithGlobalContext(<FallbackTransactions {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId('fallback-transactions-button'));
    await act(() => wait(0));
    expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.MAIN_TAB.EARN, { scrollToSection: 'mapCardSection' });
  });

  it('should navigate to apply now when transaction type is missions', async () => {
    props.transactionType = TransactionFilter.REWARDS;

    const { getByTestId } = renderWithGlobalContext(<FallbackTransactions {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId('fallback-transactions-button'));
    await act(() => wait(0));
    expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.MAIN_TAB.REWARDS);
  });
});

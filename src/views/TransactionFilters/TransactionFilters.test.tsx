import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent, waitFor } from '@testing-library/react-native';
import navigation from '@react-navigation/native';

import { TransactionFilters } from './TransactionFilters';

import { Deps } from '_models/general';
import { ActivityModel } from '_models';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';
import { getActivity_1, getActivity_2, getActivity_4, getActivity_5, getOffer_6, getOffer_8, getOffer_9 } from '_test_utils/entities';
import { wait } from '_utils/wait';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return { useNavigation: () => ({ navigate: mockedNavigate }) };
});

describe('TransactionFilters', () => {
  console.error = console.warn = () => null; // date mock messes with keys
  let deps: Deps;

  beforeEach(() => {
    navigation.useIsFocused = jest.fn(() => true);
    Date.now = () => 1980;
    deps = getMockDeps();
    deps.apiService.fetchStreakList = jest.fn().mockReturnValue([]);
  });

  it('should render transaction filters', async () => {
    const { toJSON } = renderWithGlobalContext(<TransactionFilters />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render loading', () => {
    const { getByTestId } = renderWithGlobalContext(<TransactionFilters />, deps);
    expect(getByTestId('activity-history-loading')).toBeTruthy();
  });

  it('should render fallback', async () => {
    deps.apiService.fetchActivityHistory = jest.fn().mockRejectedValueOnce('error');
    const { getByTestId } = renderWithGlobalContext(<TransactionFilters />, deps);
    await act(() => wait(0));
    expect(getByTestId('empty-state-simple')).toBeTruthy();
  });

  it('should render all transactions', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockResolvedValue(null);
    deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValue([getActivity_1(), getActivity_2()]);
    const { getAllByTestId } = renderWithGlobalContext(<TransactionFilters />, deps);
    await waitFor(() => {
      expect(getAllByTestId('offer-item-activity-row').length).toEqual(3);
    });
  });

  it('should render local offers', async () => {
    const activity = { ...getActivity_1(), offers: [getOffer_6()] };
    deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValue([getActivity_1(), getActivity_1(), activity]);
    const { getAllByTestId } = renderWithGlobalContext(<TransactionFilters />, deps);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('transaction-filters-menu-item')[1]);
    await act(() => wait(0));
    expect(getAllByTestId('offer-item-activity-row').length).toEqual(1);
  });

  it('should load more on user interaction', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockResolvedValue(null);
    deps.apiService.fetchActivityHistory = jest
      .fn()
      .mockResolvedValueOnce([
        { ...getActivity_1(), timestamp: 2 },
        { ...getActivity_2(), timestamp: 2 }
      ])
      .mockResolvedValueOnce([
        { ...getActivity_1(), timestamp: 1 },
        { ...getActivity_2(), timestamp: 1 }
      ]);
    const { getAllByTestId, getByTestId } = renderWithGlobalContext(<TransactionFilters />, deps);
    await waitFor(() => {
      expect(getAllByTestId('offer-item-activity-row')).toHaveLength(3);
      fireEvent(getByTestId('activity-history-list'), 'onEndReached');
    });
    await waitFor(() => {
      expect(getAllByTestId('offer-item-activity-row')).toHaveLength(6);
    });
  });

  it('should render missions', async () => {
    deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValue([getActivity_5()]);
    const { getAllByTestId } = renderWithGlobalContext(<TransactionFilters />, deps);
    await waitFor(() => {
      expect(getAllByTestId('transaction-filters-menu-item')).toHaveLength(5);
    });
    fireEvent.press(getAllByTestId('transaction-filters-menu-item')[2]);
    await waitFor(() => {
      expect(getAllByTestId('offer-item-activity-row').length).toEqual(2);
    });
  });

  it('should render rewards', async () => {
    const activity = { ...getActivity_1(), activityType: ActivityModel.Type.REDEMPTION, offers: [getOffer_8()] };
    deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValue([getActivity_1(), getActivity_1(), activity]);
    const { getAllByTestId } = renderWithGlobalContext(<TransactionFilters />, deps);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('transaction-filters-menu-item')[3]);
    await act(() => wait(0));
    expect(getAllByTestId('offer-item-activity-row').length).toEqual(1);
  });

  it('should render rewards without offers', async () => {
    const activity = { ...getActivity_4(), activityType: ActivityModel.Type.REDEMPTION, offers: [] };
    deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValue([getActivity_1(), getActivity_1(), activity]);
    const { getAllByTestId } = renderWithGlobalContext(<TransactionFilters />, deps);
    fireEvent.press(getAllByTestId('transaction-filters-menu-item')[3]);
    await waitFor(() => {
      expect(getAllByTestId('offer-item-activity-gc-row').length).toEqual(2);
    });
  });

  it('should render SYW Mastercard', async () => {
    const activity = { ...getActivity_1(), offers: [getOffer_9()] };
    deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValue([getActivity_1(), getActivity_1(), activity]);
    const { getAllByTestId } = renderWithGlobalContext(<TransactionFilters />, deps);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('transaction-filters-menu-item')[4]);
    await act(() => wait(0));
    expect(getAllByTestId('offer-item-activity-row').length).toEqual(1);
  });

  it('should NOT render activity', async () => {
    deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValue([getActivity_1(), getActivity_1()]);
    const { getAllByTestId, queryByTestId } = renderWithGlobalContext(<TransactionFilters />, deps);
    await act(() => wait(0));
    fireEvent.press(getAllByTestId('transaction-filters-menu-item')[1]);
    await act(() => wait(0));
    expect(queryByTestId('offer-item-activity-row')).toBeFalsy();
    fireEvent.press(getAllByTestId('transaction-filters-menu-item')[2]);
    await act(() => wait(0));
    expect(queryByTestId('offer-item-activity-row')).toBeFalsy();
    fireEvent.press(getAllByTestId('transaction-filters-menu-item')[3]);
    await act(() => wait(0));
    expect(queryByTestId('offer-item-activity-row')).toBeFalsy();
    fireEvent.press(getAllByTestId('transaction-filters-menu-item')[4]);
    await act(() => wait(0));
    expect(queryByTestId('offer-item-activity-row')).toBeFalsy();
  });
});

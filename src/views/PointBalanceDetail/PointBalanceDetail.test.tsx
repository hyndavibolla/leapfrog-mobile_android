import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react-native';

import { ENV, ROUTES } from '_constants';
import { Deps, FeatureFlag } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { getActivity_1, getActivity_2, getActivity_3, getGame } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';
import PointBalanceDetail, { Props } from './PointBalanceDetail';

describe('PointBalanceDetail', () => {
  console.error = console.warn = () => null; // date mock messes with keys
  let props: Props;
  let deps: Deps;
  let ignoredFeatureFlags: FeatureFlag[];

  beforeAll(() => {
    ignoredFeatureFlags = ENV.IGNORED_FEATURE_LIST;
  });

  beforeEach(() => {
    Date.now = () => 1980;
    props = { navigation: { navigate: jest.fn() } as any };
    deps = getMockDeps();
  });

  afterAll(() => {
    ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(deps.logger.debug).toBeCalledWith('usePNPrompt');
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render loading', async () => {
    const { queryByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    expect(queryByTestId('point-balance-detail-skeleton-container')).toBeTruthy();
    await act(() => wait(0));
  });

  it('should render without errors when there are activities with no offers', async () => {
    const activityWithoutOffers = {
      ...getActivity_1(),
      offers: null
    };
    deps.apiService.fetchActivityHistory = jest.fn(() => Promise.resolve([activityWithoutOffers]));
    const { queryByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(queryByTestId('critical-error-container')).toBeFalsy();
    expect(queryByTestId('activity-history-activities-error')).toBeFalsy();
  });

  it('should render with a fallback error', async () => {
    deps.apiService.fetchGameState = (() => Promise.reject('error')) as any;
    const { queryByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(queryByTestId('empty-state-simple')).toBeTruthy();
  });

  it('should render with a activity history critical error', async () => {
    deps.apiService.fetchActivityHistory = (() => Promise.reject('error')) as any;
    const { queryAllByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(queryAllByTestId('top-brands-section-note')).toBeTruthy();
  });

  it('should load render with activities from same and different months', async () => {
    deps.apiService.fetchActivityHistory = async () => [
      { ...getActivity_1(), timestamp: null },
      { ...getActivity_1(), timestamp: null },
      { ...getActivity_2(), timestamp: 10000000000 },
      { ...getActivity_3(), timestamp: 1000000000000 }
    ];
    const { queryAllByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(queryAllByTestId('offer-item-separator')).toHaveLength(2);
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
    const { getAllByTestId, getByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await waitFor(() => {
      expect(getAllByTestId('offer-item-activity-row')).toHaveLength(3);
      fireEvent(getByTestId('activity-history-list'), 'onEndReached');
    });
    await waitFor(() => {
      expect(getAllByTestId('offer-item-activity-row')).toHaveLength(6);
    });
  });

  it('should show activity details on press', async () => {
    deps.apiService.fetchActivityHistory = jest
      .fn()
      .mockResolvedValueOnce([
        { ...getActivity_1(), timestamp: 1 },
        { ...getActivity_1(), timestamp: 2 }
      ])
      .mockResolvedValue([]);
    const { findAllByTestId, toJSON, findByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    fireEvent.press((await findAllByTestId('offer-item-activity-row'))[0]); // open first
    fireEvent.press(await findByTestId('modal-backdrop')); // close it
    fireEvent.press((await findAllByTestId('offer-item-activity-row'))[1]); // open second
    expect(toJSON()).toMatchSnapshot();
  });

  it('should navigate to how it works screen on press', async () => {
    const { getByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    fireEvent.press(getByTestId('point-balance-detail-info-btn'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.HOW_IT_WORKS.TITLE);
  });

  it('should navigate to rewards on press', async () => {
    const { getByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    fireEvent.press(getByTestId('point-balance-detail-rewards-btn'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.MAIN_TAB.REWARDS);
  });

  it('should render with expiring points today', async () => {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = oneDay * 3;
    Date.now = () => today;
    deps.apiService.fetchGameState = jest.fn().mockResolvedValue({
      ...getGame(),
      balance: {
        memberOwnPointsToExpire: [
          { memberOwnPoints: 1000, memberOwnExpiryDate: today + 1 },
          { memberOwnPoints: 1000, memberOwnExpiryDate: today + 2 },
          { memberOwnPoints: 1000, memberOwnExpiryDate: today + 3 }
        ]
      }
    });

    const { queryByTestId, toJSON } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
    expect(queryByTestId('point-balance-detail-expire-points-some')).toBeTruthy();
    expect(queryByTestId('point-balance-detail-expire-points-today')).toBeTruthy();
  });

  it('should render with expiring points tomorrow', async () => {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = oneDay;
    Date.now = () => today;
    deps.apiService.fetchGameState = jest.fn().mockResolvedValue({
      ...getGame(),
      balance: { memberOwnPointsToExpire: [{ memberOwnPoints: 1000, memberOwnExpiryDate: today + oneDay }] }
    });

    const { queryByTestId, toJSON } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
    expect(queryByTestId('point-balance-detail-expire-points-some')).toBeTruthy();
    expect(queryByTestId('point-balance-detail-expire-points-tomorrow')).toBeTruthy();
  });

  it('should render with expiring points in less than a month', async () => {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = oneDay;
    Date.now = () => today;
    deps.apiService.fetchGameState = jest.fn().mockResolvedValue({
      ...getGame(),
      balance: { memberOwnPointsToExpire: [{ memberOwnPoints: 1000, memberOwnExpiryDate: today + oneDay * 5 }] }
    });

    const { queryByTestId, toJSON } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
    expect(queryByTestId('point-balance-detail-expire-points-some')).toBeTruthy();
    expect(queryByTestId('point-balance-detail-expire-points-month')).toBeTruthy();
  });

  it('should render with expiring points in more than a month', async () => {
    deps.apiService.fetchGameState = jest.fn().mockResolvedValue({
      ...getGame(),
      balance: { memberOwnPointsToExpire: [{ memberOwnPoints: 1000, memberOwnExpiryDate: 3890000000 }] }
    });

    const { queryByTestId, toJSON } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
    expect(queryByTestId('point-balance-detail-expire-points-some')).toBeTruthy();
    expect(queryByTestId('point-balance-detail-expire-points-future')).toBeTruthy();
  });

  it('should render error with expiring points number', async () => {
    deps.apiService.fetchGameState = jest.fn().mockResolvedValue({
      ...getGame(),
      balance: { memberOwnPointsToExpire: [{ memberOwnExpiryDate: 88400000 }] }
    });

    const { queryByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(queryByTestId('point-balance-detail-expire-points-number-error')).toBeTruthy();
    expect(queryByTestId('point-balance-detail-expire-points-tomorrow')).toBeTruthy();
  });

  it('should render error with expiring points date', async () => {
    deps.apiService.fetchGameState = jest.fn().mockResolvedValue({
      ...getGame(),
      balance: { memberOwnPointsToExpire: [{ memberOwnPoints: 540 }] }
    });

    const { queryByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(queryByTestId('point-balance-detail-expire-points-number-error')).toBeTruthy();
    expect(queryByTestId('point-balance-detail-expire-points-date-error')).toBeTruthy();
  });

  it('should not render pointsavailable activity types', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockResolvedValue(null);
    deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValue([
      { ...getActivity_1(), timestamp: 2 },
      { ...getActivity_3(), timestamp: 1 }
    ]);
    const { getAllByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await waitFor(() => {
      expect(getAllByTestId('offer-item-activity-row')).toHaveLength(2);
    });
  });

  it('should not render see all transactions', async () => {
    const { queryByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(queryByTestId('point-balance-detail-see-all-btn')).toBeFalsy();
  });

  it('should render see all transactions', async () => {
    ENV.IGNORED_FEATURE_LIST.splice(ENV.IGNORED_FEATURE_LIST.indexOf(FeatureFlag.SEE_ALL_TRANSACTIONS), 1);
    const { queryByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(queryByTestId('point-balance-detail-see-all-btn')).toBeTruthy();
  });

  it('should navigate to transactions filters', async () => {
    ENV.IGNORED_FEATURE_LIST.splice(ENV.IGNORED_FEATURE_LIST.indexOf(FeatureFlag.SEE_ALL_TRANSACTIONS), 1);
    const { getByTestId } = renderWithGlobalContext(<PointBalanceDetail {...props} />, deps);
    await act(() => wait(0));
    expect(getByTestId('point-balance-detail-see-all-btn')).toBeTruthy();
    fireEvent.press(getByTestId('point-balance-detail-see-all-btn'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.TRANSACTION_FILTERS.MAIN);
  });
});

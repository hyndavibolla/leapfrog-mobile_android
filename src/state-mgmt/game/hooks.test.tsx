import { act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';

import { getMockDeps } from '_test_utils/getMockDeps';
import { getGame, getActivity_1, getActivity_2, getActivity_3, getOffer_1, getGiftCard } from '_test_utils/entities';
import { renderWrappedHook } from '_test_utils/renderWrappedHook';
import { getStateSnapshotStorage } from '_utils/getStateSnapshotStorage';
import { getInitialState } from '_state_mgmt/GlobalState';
import { ACTION_TYPE as CORE_ACTION_TYPE } from '_state_mgmt/core/actions';
import { ActivityModel, GameModel } from '_models';
import { Deps, IGlobalState } from '_models/general';

import { actions } from './actions';
import { useGetCurrentGame, useGetActivity, useRestoreCurrentGame, usePointsModal, useGetStreakActivitiesGroupedByDate, useActivityAfterBuyGC } from './hooks';

describe('game hooks', () => {
  let deps: Deps;
  let mockReducer: any;
  let state: IGlobalState;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    state = { ...initialState, game: { ...initialState.game, current: { ...initialState.game.current, lastUpdatedAt: 1 } } };
    mockReducer = jest.fn().mockReturnValue(state);
    deps = getMockDeps();
    deps.apiService.fetchStreakList = jest.fn().mockResolvedValue([]);
    deps.stateSnapshot = getStateSnapshotStorage();
  });

  describe('useGetCurrentGame', () => {
    it('should fetch and set current game data', async () => {
      state = {
        ...state,
        game: { ...state.game, current: { ...state.game.current } }
      };
      const game = { ...getGame(), userHasSywCard: false };
      deps.stateSnapshot.get = () => initialState;
      deps.apiService.fetchGameState = jest.fn().mockResolvedValue(game) as any;
      const { result } = renderWrappedHook(() => useGetCurrentGame(), deps, state, mockReducer);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(deps.apiService.fetchGameState).toBeCalled();
        expect(deps.nativeHelperService.storage.set).toBeCalled();
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setPartialGameState(game));
        expect(mockReducer).not.toBeCalledWith(expect.any(Object), { type: CORE_ACTION_TYPE.ADD_MODAL, payload: expect.any(Object) });
      });
    });

    it('should use points modal for available points', async () => {
      Date.now = () => 1;
      state.game.current.balance.pendingPoints = 100;
      state.game.current.balance.availablePoints = 100;
      const game = getGame();
      game.balance.pendingPoints = 100;
      game.balance.availablePoints = 100;
      deps.stateSnapshot.get = () => state;
      deps.apiService.fetchGameState = jest.fn().mockResolvedValue(game) as any;
      const { result } = renderWrappedHook(() => useGetCurrentGame(), deps, state, mockReducer);
      await act(async () => {
        expect(deps.logger.info).not.toBeCalledWith('usePointsModal', expect.any(Object));
        await (result.current[0] as () => Promise<any>)();
      });
    });

    it('should use points modal for pending points', async () => {
      Date.now = () => 1;
      state.game.current.balance.pendingPoints = 100;
      state.game.current.balance.availablePoints = 100;
      const game = getGame();
      game.balance.pendingPoints = 200;
      game.balance.availablePoints = 100;
      deps.stateSnapshot.get = () => state;
      deps.apiService.fetchGameState = jest.fn().mockResolvedValue(game) as any;
      const { result } = renderWrappedHook(() => useGetCurrentGame(), deps, state, mockReducer);
      await act(async () => {
        expect(deps.logger.info).not.toBeCalledWith('usePointsModal', expect.any(Object));
        await (result.current[0] as () => Promise<any>)();
      });
    });
  });

  describe('usePointsModal', () => {
    it("should NOT dispatch a modal action when user hasn't earned points", async () => {
      const { result } = renderWrappedHook(() => usePointsModal(), deps, state, mockReducer);
      await act(async () => {
        await result.current[0](false, getGame(), null);
        expect(deps.logger.info).not.toBeCalledWith('usePointsModal', expect.any(Object));
        expect(mockReducer).not.toBeCalledWith(expect.any(Object), { type: CORE_ACTION_TYPE.ADD_MODAL, payload: expect.any(Object) });
      });
    });

    it('should dispatch a modal action when user has earned points', async () => {
      state.game.current.balance.availablePoints = 10;
      const game = getGame();
      game.balance.availablePoints = 15;
      deps.stateSnapshot.get = () => state;
      deps.apiService.fetchGameState = jest.fn().mockResolvedValue(game) as any;
      const { result } = renderWrappedHook(() => usePointsModal(), deps, state, mockReducer);
      await act(async () => {
        await (result.current[0] as (...args: any[]) => Promise<any>)(true, getGame(), GameModel.LevelState.PROMOTION);
        expect(deps.logger.debug).toBeCalledWith('usePointsModal', expect.any(Object));
        expect(deps.apiService.fetchActivityHistory).toBeCalledWith({ to: expect.anything(), from: expect.anything() });
        expect(mockReducer).toBeCalledWith(expect.any(Object), { type: CORE_ACTION_TYPE.ADD_MODAL, payload: expect.any(Object) });
      });
    });

    it('should NOT dispatch a modal action when user has earned points BUT not new activities are retrieved', async () => {
      state.game.current.balance.availablePoints = 10;
      const game = getGame();
      game.balance.availablePoints = 15;
      deps.stateSnapshot.get = () => state;
      deps.apiService.fetchGameState = jest.fn().mockResolvedValue(game) as any;
      deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValue([]) as any;

      const { result } = renderWrappedHook(() => usePointsModal(), deps, state, mockReducer);
      await act(async () => {
        await (result.current[0] as (...args: any[]) => Promise<any>)(true, getGame(), GameModel.LevelState.PROMOTION);
        expect(deps.logger.debug).toBeCalledWith('usePointsModal', expect.any(Object));
        expect(deps.apiService.fetchActivityHistory).toBeCalledWith({ to: expect.anything(), from: expect.anything() });
        expect(mockReducer).not.toBeCalledWith(expect.any(Object), { type: CORE_ACTION_TYPE.ADD_MODAL, payload: expect.any(Object) });
      });
    });
  });

  describe('useGetActivity', () => {
    let activityList: ActivityModel.IActivity[];
    let start: Date;
    beforeEach(() => {
      Date.now = () => new Date(getActivity_1().timestamp).getTime(); // relevant to delta limit which is based on "now"
      activityList = [
        { ...getActivity_1(), offers: [getOffer_1()] },
        { ...getActivity_2(), offers: [] },
        { ...getActivity_3(), offers: [] }
      ];
      start = new Date(getActivity_1().timestamp);
      deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValue(activityList);
    });

    it('should fetch activity and offer list', async () => {
      const { result } = renderWrappedHook(() => useGetActivity(), deps, state, mockReducer);
      await act(async () => {
        await (result.current[0] as (...args: any[]) => Promise<any>)(start);
        expect(deps.apiService.fetchActivityHistory).toBeCalledTimes(1);
        expect(result.current[3]).toEqual(activityList);
      });
    });

    it('should recursively fetch activity and offer list to fill the envs min amount of results', async () => {
      deps.apiService.fetchActivityHistory = jest
        .fn()
        .mockResolvedValueOnce([activityList[0]])
        .mockResolvedValueOnce([activityList[1]])
        .mockResolvedValueOnce([activityList[2]]); // not called because min amount of activities was reached
      const { result } = renderWrappedHook(() => useGetActivity(), deps, state, mockReducer);
      await act(async () => {
        await (result.current[0] as (...args: any[]) => Promise<any>)(start);
        expect(deps.apiService.fetchActivityHistory).toBeCalledTimes(2);
        expect(result.current[3]).toEqual([activityList[0], activityList[1]]);
      });
    });

    it('should not fetch passed the envs max time delta even if the envs min amount of results is not met', async () => {
      deps.apiService.fetchActivityHistory = jest
        .fn()
        .mockResolvedValueOnce([activityList[0]])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([activityList[1]]); // not called because max delta was reached
      const { result } = renderWrappedHook(() => useGetActivity(), deps, state, mockReducer);
      await act(async () => {
        await (result.current[0] as (...args: any[]) => Promise<any>)(start);
        expect(deps.apiService.fetchActivityHistory).toBeCalledTimes(3);
        expect(result.current[3]).toEqual([activityList[0]]);
      });
    });
  });

  describe('useRestoreCurrentGame', () => {
    it('should restore current game', async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(getGame());
      const { result } = renderWrappedHook(() => useRestoreCurrentGame(), deps, undefined, mockReducer);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(mockReducer).toBeCalledWith(expect.any(Object), actions.setPartialGameState(getGame()));
      });
    });

    it("should NOT restore current game when it wasn't saved", async () => {
      deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(null);
      const { result } = renderWrappedHook(() => useRestoreCurrentGame(), deps, undefined, mockReducer);
      await act(async () => {
        await (result.current[0] as () => Promise<any>)();
        expect(mockReducer).not.toBeCalled();
      });
    });
  });

  describe('useGetStreakActivitiesGroupedByDate', () => {
    it('should fetch streak activities and group them by date', async () => {
      deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValue([getActivity_1(), getActivity_2(), getActivity_3()]);
      const { result } = renderWrappedHook(() => useGetStreakActivitiesGroupedByDate(), deps);
      await act(async () => {
        await (result.current[0] as (...args: any[]) => Promise<any>)(1234, 'code-1');
        expect(deps.apiService.fetchActivityHistory).toBeCalledWith({ from: 1234, rewardOfferCode: 'code-1' });
        expect(result.current[3]).toEqual({ '2020-01': [getActivity_1(), getActivity_2(), getActivity_3()] });
      });
    });
  });

  describe('useActivityAfterBuyGC', () => {
    it('should dispatch points modal when user has bought GC', async () => {
      state.giftCard.giftCardsList = [];
      deps.apiService.fetchGiftCardList = jest.fn().mockResolvedValueOnce({ giftCards: [getGiftCard()] });
      const { result } = renderWrappedHook(() => useActivityAfterBuyGC(), deps, state, mockReducer);
      await waitFor(() => {
        result.current[0]();
        expect(deps.apiService.fetchGiftCardList).toBeCalled();
        expect(deps.apiService.fetchGameState).toBeCalled();
        expect(deps.nativeHelperService.storage.set).toBeCalled();
        expect(mockReducer).toBeCalledWith(expect.any(Object), { type: CORE_ACTION_TYPE.ADD_MODAL, payload: expect.any(Object) });
      });
    });

    it('should not dispatch points modal when user has not bought GC', async () => {
      state.giftCard.giftCardsList = [getGiftCard()];
      deps.apiService.fetchGiftCardList = jest.fn().mockResolvedValueOnce({ giftCards: [getGiftCard()] });
      const { result } = renderWrappedHook(() => useActivityAfterBuyGC(), deps, state, mockReducer);
      await waitFor(() => {
        result.current[0]();
        expect(deps.apiService.fetchGiftCardList).toBeCalled();
        expect(deps.apiService.fetchGameState).not.toBeCalled();
        expect(mockReducer).not.toBeCalledWith(expect.any(Object), { type: CORE_ACTION_TYPE.ADD_MODAL, payload: expect.any(Object) });
      });
    });
  });
});

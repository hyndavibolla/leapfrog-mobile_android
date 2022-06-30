import React, { useContext } from 'react';
import moment from 'moment';

import { GlobalContext } from '../GlobalState';
import { actions } from './actions';
import { actions as coreActions } from '../core/actions';
import { useAsyncCallback } from '_utils/useAsyncCallback';
import { useErrorLog } from '../core/hooks';
import { ENV } from '_constants/env';
import { ActivityModel, GameModel } from '_models';
import { DateLike, Deps } from '_models/general';
import { PointsType, ProgramType } from '_models/offer';
import { ModalSize } from '_views/shared/Modal';
import { ClaimPointsModal } from '_views/shared/ClaimPointsModal';
import { wait } from '_utils/wait';
import { useGiftCards } from '_state_mgmt/giftCard';

export const useActivityAfterBuyGC = (throwOnRejection?: boolean) => {
  const { deps } = useContext(GlobalContext);
  const [onPointsModal] = usePointsModal();
  const [onLoadGiftCardsList] = useGiftCards();
  const activityList = useAsyncCallback(
    async (force?: boolean) => {
      deps.logger.info('Getting giftcard list', { force });
      const prevGiftCards = deps.stateSnapshot.get().giftCard.giftCardsList;
      const currentGiftCards = await onLoadGiftCardsList();
      const hasBoughtGiftCards = prevGiftCards.length < currentGiftCards.length;

      if (!hasBoughtGiftCards) return;

      deps.logger.info('Getting user Game State', { force });
      const prevCurrentGame = deps.stateSnapshot.get().game.current;
      const currentGame = await deps.apiService.fetchGameState(force);

      await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.GAME_CURRENT, currentGame);
      const hasEarnedAvailablePoints = prevCurrentGame.balance.availablePoints < currentGame.balance.availablePoints;

      await onPointsModal(true, currentGame, hasEarnedAvailablePoints);
    },
    [],
    throwOnRejection
  );
  useErrorLog(activityList[2], 'There was an issue fetching activity list after buy a gc');
  return activityList;
};

export const useGetCurrentGame = (throwOnRejection?: boolean) => {
  const { dispatch, deps } = useContext(GlobalContext);
  const [onPointsModal] = usePointsModal();
  const currentGameState = useAsyncCallback(
    async (force?: boolean) => {
      deps.logger.info('Getting user Game State', { force: !!force });
      const prevCurrentGame = deps.stateSnapshot.get().game.current;
      const currentGame = await deps.apiService.fetchGameState(force);

      await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.GAME_CURRENT, currentGame);
      const onUpdateGame = () => dispatch(actions.setPartialGameState(currentGame));
      const isInitialFetchEver = !prevCurrentGame.lastUpdatedAt;
      const hasEarnedAvailablePoints = prevCurrentGame.balance.availablePoints < currentGame.balance.availablePoints;
      const hasEarnedPendingPoints = prevCurrentGame.balance.pendingPoints < currentGame.balance.pendingPoints;
      const hasEarnedPoints = hasEarnedAvailablePoints || hasEarnedPendingPoints;

      if (isInitialFetchEver || !hasEarnedPoints) return onUpdateGame();

      await onPointsModal(!!hasEarnedPoints, currentGame, hasEarnedAvailablePoints);
    },
    [],
    throwOnRejection
  );
  useErrorLog(currentGameState[2], 'There was an issue fetching game data');
  return currentGameState;
};

export const usePointsModal = (throwOnRejection?: boolean) => {
  const { dispatch, deps } = useContext(GlobalContext);
  return useAsyncCallback(
    async (shouldShow: boolean, currentGame: GameModel.IGame, showAnimation: boolean) => {
      if (!shouldShow) return;

      deps.logger.info('Showing points modal');
      deps.logger.debug('usePointsModal', { showAnimation });
      const prevCurrentGame = deps.stateSnapshot.get().game.current;
      const key = `claim-points-from-${prevCurrentGame.balance.availablePoints}-to-${currentGame.balance.availablePoints}`;
      const onUpdateGame = /* istanbul ignore next */ () => dispatch(actions.setPartialGameState(currentGame));
      const onRequestClose = /* istanbul ignore next */ () => {
        dispatch(coreActions.removeModal(key));
        onUpdateGame();
      };
      const activities = await deps.apiService.fetchActivityHistory({ to: Date.now(), from: prevCurrentGame.lastUpdatedAt });
      const activityList = Object.values<ActivityModel.IActivity>([...activities].reduce((total, curr) => ({ ...total, [String(curr.timestamp)]: curr }), {}));
      const offerTypeList = activityList.map(activity => activity.offers.map(offer => offer.pointsType));
      const hasSomeReturnActivity = offerTypeList.flat().some(item => item === PointsType.EARN);

      if (!activityList?.length || !hasSomeReturnActivity) return;

      await wait(0);
      dispatch(
        coreActions.addModal(key, {
          size: ModalSize.EXTRA_LARGE,
          onClose: onUpdateGame,
          children: <ClaimPointsModal activityList={activityList} onRequestClose={onRequestClose} showAnimation={showAnimation} />
        })
      );
    },
    [],
    throwOnRejection
  );
};

const markStreakOffers = async (deps: Deps, activities: ActivityModel.IActivity[], to: DateLike, from: DateLike, cardId: string) => {
  /** @todo: Work on a better solution with BE **/
  try {
    let streakActivities: string[] = [];
    // Get current active streak. We are thinking this for only one active streak at a time.
    const responseFetchStreakList = await deps.apiService.fetchStreakList();
    if (responseFetchStreakList.length) {
      // Current fetchActivityHistory doesn't support more than one rewardOfferCode on the query param.
      const responseFetchActivityHistory = await deps.apiService.fetchActivityHistory({
        to,
        from,
        rewardOfferCode: responseFetchStreakList[0].rewardOfferCode,
        cardId
      });
      // Mark streak offers. We won't be able to retrieve historical if the active streak list comes empty.
      if (responseFetchActivityHistory.length) {
        streakActivities = responseFetchActivityHistory.map(activity => activity.txnId).filter(values => values);
      }
    }
    activities.forEach(activity => {
      if (streakActivities.includes(activity.txnId) || activity.offers?.find(offer => offer.programType === ProgramType.STREAK)) {
        activity.offers?.forEach(offer => {
          offer.isStreak = true;
        });
      }
    });
  } catch (error) {
    deps.logger.error(error);
  }
};

export const useGetActivity = () => {
  const { deps } = useContext(GlobalContext);
  const activityListState: [
    (start?: DateLike, cardId?: string, end?: DateLike) => Promise<ActivityModel.IActivity[]>,
    boolean,
    any,
    ActivityModel.IActivity[]
  ] = useAsyncCallback(async (start?: DateLike, cardId?: string, end?: DateLike) => {
    deps.logger.info('Getting user activity', { start });
    /**
     * recursive function to fetch batches by env time delta window accumulating activities to either reach the min amount of activities or the max time delta
     * */
    const fetchNextBatch = async (
      startingPoint: DateLike,
      prevBatch: ActivityModel.IActivity[] = [],
      nextCardId?: string,
      endingPoint?: DateLike
    ): Promise<ActivityModel.IActivity[]> => {
      /** max date to set as a starting point from which to fetch activities */
      const deltaLimitDate = moment(Date.now()).subtract(ENV.MAX_ACTIVITY_FETCH_HISTORY_MONTH_DELTA, 'months').toDate();
      /** to compensate for time added to request timestamps to (try to) avoid collisions on response */
      const deltaLimit = deltaLimitDate.setMilliseconds(deltaLimitDate.getMilliseconds() + ENV.ACTIVITY_FETCH_HISTORY_MONTH_DELTA * 1000);
      const nextEnd = new Date(Math.max(moment(startingPoint).subtract(ENV.ACTIVITY_FETCH_HISTORY_MONTH_DELTA, 'months').toDate().getTime(), deltaLimit));
      if (deltaLimit >= nextEnd.getTime()) return prevBatch; /** don't fetch older than max delta */
      const response = await deps.apiService.fetchActivityHistory({ to: startingPoint, from: endingPoint || deltaLimit, cardId: nextCardId });

      await markStreakOffers(deps, response, startingPoint, endingPoint, nextCardId);

      const fullResponse = [...prevBatch, ...response];
      /** recursively gathers more resources if min amount is not met */
      return fullResponse.length < ENV.MIN_ACTIVITY_FETCH_HISTORY_RESULTS
        ? fetchNextBatch(
            nextEnd.setMilliseconds(nextEnd.getMilliseconds() + 1000 /** adding one second to (try to) avoid collisions on response */),
            fullResponse,
            nextCardId
          )
        : fullResponse;
    };
    const activityList = await fetchNextBatch(start, undefined, cardId, end);
    return activityList;
  }, []);
  useErrorLog(activityListState[2], 'There was an issue fetching activity list');
  return activityListState;
};

export const useGetStreakActivitiesGroupedByDate = () => {
  const { deps } = useContext(GlobalContext);
  return useAsyncCallback(async (from: DateLike, rewardOfferCode: string) => {
    deps.logger.info('Getting streaks activities', { from, rewardOfferCode });
    const response = await deps.apiService.fetchActivityHistory({ from, rewardOfferCode });
    return response.reduce((result, activity) => {
      const date = moment(activity.timestamp).format('YYYY-MM');
      return { ...result, [date]: [...(result[date] || []), activity] };
    }, {});
  }, []);
};

export const useRestoreCurrentGame = () => {
  const { deps, dispatch } = useContext(GlobalContext);
  return useAsyncCallback(async () => {
    deps.logger.debug('useRestoreCurrentGame');
    const currentGame = await deps.nativeHelperService.storage.get<GameModel.IGame>(ENV.STORAGE_KEY.GAME_CURRENT);
    if (currentGame) dispatch(actions.setPartialGameState(currentGame));
  }, []);
};

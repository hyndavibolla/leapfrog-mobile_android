import { GameModel } from '../../models';

export enum ACTION_TYPE {
  SET_PARTIAL_GAME_STATE = '[game] set partial game state',
  SET_LEVEL_MAP = '[game] set level map',
  SET_HISTORICAL_POINT_TOTAL = '[game] set historical point total',
  SET_HISTORICAL_POINT_BY_MONTH_MAP = '[game] set historical point by month map'
}

export const actions = {
  setPartialGameState: (current: Partial<GameModel.IGame>) => ({ type: ACTION_TYPE.SET_PARTIAL_GAME_STATE, payload: { current } }),
  setHistoricalPointTotal: (totalLifetimeEarnedPoints: number) => ({ type: ACTION_TYPE.SET_HISTORICAL_POINT_TOTAL, payload: { totalLifetimeEarnedPoints } }),
  setHistoricalPointByMonthMap: (pointByMonthMap: Record<string, number>) => ({
    type: ACTION_TYPE.SET_HISTORICAL_POINT_BY_MONTH_MAP,
    payload: { pointByMonthMap }
  })
};

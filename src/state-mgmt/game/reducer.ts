import { IAction } from '../../models/general';
import { ACTION_TYPE } from './actions';
import { IGameState, initialState } from './state';

export const reducer = (state: IGameState = initialState, { type, payload }: IAction): IGameState => {
  switch (type) {
    case ACTION_TYPE.SET_PARTIAL_GAME_STATE:
      return { ...state, current: { ...state.current, ...payload.current } };
    case ACTION_TYPE.SET_HISTORICAL_POINT_TOTAL:
      return { ...state, historical: { ...state.historical, totalLifetimeEarnedPoints: payload.totalLifetimeEarnedPoints } };
    case ACTION_TYPE.SET_HISTORICAL_POINT_BY_MONTH_MAP:
      return { ...state, historical: { ...state.historical, pointByMonthMap: { ...state.historical.pointByMonthMap, ...payload.pointByMonthMap } } };
    default:
      return state;
  }
};

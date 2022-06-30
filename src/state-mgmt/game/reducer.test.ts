import { reducer } from './reducer';
import { initialState } from './state';
import { actions } from './actions';

describe('game reducer', () => {
  it('should return the previous state when no switch case matches', () => {
    expect(reducer(undefined, { type: null, payload: null })).toBe(initialState);
  });

  it('should return a new state SET_HISTORICAL_POINT_TOTAL', () => {
    expect(reducer(initialState, actions.setHistoricalPointTotal(123))).toEqual({
      ...initialState,
      historical: { ...initialState.historical, totalLifetimeEarnedPoints: 123 }
    });
  });

  it('should return a new state SET_HISTORICAL_POINT_BY_MONTH_MAP', () => {
    expect(
      reducer(
        { ...initialState, historical: { ...initialState.historical, pointByMonthMap: { january: 123 } } },
        actions.setHistoricalPointByMonthMap({ february: 456 })
      )
    ).toEqual({
      ...initialState,
      historical: { ...initialState.historical, pointByMonthMap: { january: 123, february: 456 } }
    });
  });
});

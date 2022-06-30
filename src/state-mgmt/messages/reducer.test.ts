import { reducer } from './reducer';
import { initialState } from './state';
import { actions } from './actions';
import { getSailthruMessage_1 } from '../../test-utils/entities';

describe('core reducer', () => {
  it('should return the previous state when no switch case matches', () => {
    expect(reducer(undefined, { type: null, payload: null })).toBe(initialState);
  });

  it('should return a new state ACTION_TYPE.SET_SAILTHRU_MESSAGES', () => {
    expect(reducer(initialState, actions.setSailthruMessages([getSailthruMessage_1()]))).toEqual({
      ...initialState,
      sailthru: [getSailthruMessage_1()]
    });
  });

  it('should return a new state ACTION_TYPE.SET_LAST_NEW_ON_MAX_ONBOARD_DATE', () => {
    const date = Date.now();
    expect(reducer(initialState, actions.setLastNewOnMaxOnboardDate(date))).toEqual({
      ...initialState,
      lastNewOnMaxOnboardDate: date
    });
  });
});

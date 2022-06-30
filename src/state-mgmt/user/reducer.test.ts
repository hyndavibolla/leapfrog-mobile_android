import { reducer } from './reducer';
import { initialState } from './state';
import { actions } from './actions';
import { getUser } from '../../test-utils/entities';

describe('user reducer', () => {
  it('should return the previous state when no switch case matches', () => {
    expect(reducer(undefined, { type: null, payload: null })).toBe(initialState);
  });

  it('should return a new state ACTION_TYPE.SET_CURRENT', () => {
    expect(reducer(initialState, actions.setCurrentUser(getUser()))).toEqual({
      ...initialState,
      currentUser: {
        ...getUser(),
        personal: {
          ...getUser().personal,
          homeAddress: { ...getUser().personal.homeAddress, stateOther: initialState.currentUser.personal.homeAddress.stateOther }
        }
      }
    });
  });
});

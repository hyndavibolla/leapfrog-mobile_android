import { combineReducers } from './combineReducers';
import { GeneralModel } from '../models';

describe('combineReducers', () => {
  let combinedReducer: GeneralModel.IReducer<{ a: number; b: string }>;
  let initialState: { a: number; b: string };
  beforeEach(() => {
    initialState = { a: 5, b: 'initial' };
    combinedReducer = combineReducers({
      a: (state, action) => {
        if (action.type === 'goA') return state + action.payload;
        return state;
      },
      b: (state, action) => {
        if (action.type === 'goB') return `${state}-${action.payload}`;
        return state;
      }
    });
  });

  it('should return a new state for individual reducers', () => {
    expect(combinedReducer(initialState, { type: 'goA', payload: 1 })).toEqual({ ...initialState, a: 6 });
    expect(combinedReducer(initialState, { type: 'goB', payload: 'b' })).toEqual({ ...initialState, b: 'initial-b' });
    expect(initialState).toEqual({ a: 5, b: 'initial' });
  });

  it('should NOT return a new state when no reducer had matches', () => {
    expect(combinedReducer(initialState, { type: 'unknown', payload: 1 })).toBe(initialState);
  });

  it('should return a new state for all matching reducers', () => {
    combinedReducer = combineReducers({
      a: (state, action) => {
        if (action.type === 'goC') return state + action.payload;
        return state;
      },
      b: (state, action) => {
        if (action.type === 'goC') return `${state}-${action.payload}`;
        return state;
      }
    });
    expect(combinedReducer(initialState, { type: 'goC', payload: 1 })).toEqual({ ...initialState, a: 6, b: 'initial-1' });
  });
});

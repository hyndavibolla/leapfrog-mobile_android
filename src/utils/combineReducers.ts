import { IAction, IReducer } from '../models/general';

export function combineReducers<GS>(reducerMap: Record<string, (state: any, action: IAction) => any>): IReducer<GS> {
  return (gState: GS, gAction: IAction) => {
    const nextState = Object.entries(reducerMap).reduce(
      (total, [stateKey, reducer]) => ({ ...total, [stateKey]: reducer(gState[stateKey], gAction) }),
      {} as GS
    );
    const stateKeys = Array.from(new Set([...Object.keys(gState), ...Object.keys(nextState)]));
    const hasChanged = stateKeys.some(key => gState[key] !== nextState[key]);
    return hasChanged ? nextState : gState;
  };
}

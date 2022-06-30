import React, { createContext, memo, PropsWithChildren, useReducer, Dispatch, useEffect } from 'react';

import { IGlobalState, Deps, IReducer, IGlobalContext } from '_models/general';
import { reducer as coreReducer } from './core/reducer';
import { reducer as userReducer } from './user/reducer';
import { reducer as gameReducer } from './game/reducer';
import { reducer as missionReducer } from './mission/reducer';
import { reducer as rewardReducer } from './reward/reducer';
import { reducer as surveyReducer } from './survey/reducer';
import { reducer as messagesReducer } from './messages/reducer';
import { reducer as cardLinkReducer } from './cardLink/reducer';
import { reducer as giftCardReducer } from './giftCard/reducer';
import { initialState as coreInitialState } from './core/state';
import { initialState as userInitialState } from './user/state';
import { initialState as gameInitialState } from './game/state';
import { initialState as missionInitialState } from './mission/state';
import { initialState as rewardInitialState } from './reward/state';
import { initialState as surveyInitialState } from './survey/state';
import { initialState as messagesInitialState } from './messages/state';
import { initialState as cardLinkInitialState } from './cardLink/state';
import { initialState as giftCardInitialState } from './giftCard/state';
import { combineReducers } from '_utils/combineReducers';
import { GeneralModel } from '_models';
import { deepClone } from '_utils/deepClone';

export const getInitialState = () =>
  deepClone<IGlobalState>({
    core: coreInitialState,
    user: userInitialState,
    game: gameInitialState,
    mission: missionInitialState,
    reward: rewardInitialState,
    survey: surveyInitialState,
    messages: messagesInitialState,
    cardLink: cardLinkInitialState,
    giftCard: giftCardInitialState
  });

export const combinedReducer = combineReducers<GeneralModel.IGlobalState>({
  core: coreReducer,
  user: userReducer,
  game: gameReducer,
  mission: missionReducer,
  reward: rewardReducer,
  survey: surveyReducer,
  messages: messagesReducer,
  cardLink: cardLinkReducer,
  giftCard: giftCardReducer
});

export const GlobalContext = createContext<{ state: IGlobalState; dispatch: Dispatch<any>; deps: Deps }>({
  state: getInitialState(),
  dispatch: /* istanbul ignore next */ () => null,
  deps: null
} as IGlobalContext);

export const GlobalProvider = memo(
  ({
    children,
    deps,
    initState,
    combinedReducers
  }: PropsWithChildren<{
    deps: Deps;
    initState: IGlobalState;
    combinedReducers: IReducer<IGlobalState>;
  }>) => {
    const [state, dispatch] = useReducer(combinedReducers, initState);
    useEffect(() => deps.stateSnapshot.set(state), [state]); // eslint-disable-line react-hooks/exhaustive-deps
    return <GlobalContext.Provider value={{ state, dispatch, deps } as IGlobalContext}>{children}</GlobalContext.Provider>;
  }
);

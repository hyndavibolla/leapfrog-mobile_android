import { IAction } from '../../models/general';
import { ACTION_TYPE } from './actions';
import { IMessagesState, initialState } from './state';

export const reducer = (state: IMessagesState = initialState, { type, payload }: IAction): IMessagesState => {
  switch (type) {
    case ACTION_TYPE.SET_SAILTHRU_MESSAGES:
      return { ...state, sailthru: payload.messages };
    case ACTION_TYPE.SET_LAST_NEW_ON_MAX_ONBOARD_DATE:
      return { ...state, lastNewOnMaxOnboardDate: payload.lastOnboard };
    default:
      return state;
  }
};

import { ISailthruMessage } from '../../models/general';

export enum ACTION_TYPE {
  SET_SAILTHRU_MESSAGES = '[messages] set sailthru messages',
  SET_LAST_NEW_ON_MAX_ONBOARD_DATE = '[messages] set last new on max onboard date'
}

export const actions = {
  setSailthruMessages: (messages: ISailthruMessage[]) => ({ type: ACTION_TYPE.SET_SAILTHRU_MESSAGES, payload: { messages } }),
  setLastNewOnMaxOnboardDate: (lastOnboard: number) => ({ type: ACTION_TYPE.SET_LAST_NEW_ON_MAX_ONBOARD_DATE, payload: { lastOnboard } })
};

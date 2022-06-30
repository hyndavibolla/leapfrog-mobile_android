import { DateLike, ISailthruMessage } from '../../models/general';

export interface IMessagesState {
  sailthru: ISailthruMessage[];
  lastNewOnMaxOnboardDate: DateLike;
}

export const initialState: IMessagesState = {
  sailthru: [],
  lastNewOnMaxOnboardDate: null
};

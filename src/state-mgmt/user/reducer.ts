import { UserModel } from '../../models';
import { IAction } from '../../models/general';
import { mergeTruthy } from '../../utils/mergeTruthy';
import { ACTION_TYPE } from './actions';
import { IUserState, initialState } from './state';

export const reducer = (state: IUserState = initialState, { type, payload }: IAction): IUserState => {
  switch (type) {
    case ACTION_TYPE.SET_CURRENT_USER:
      return { ...state, currentUser: mergeTruthy<UserModel.IUser>(state.currentUser, payload.user) };
    default:
      return state;
  }
};

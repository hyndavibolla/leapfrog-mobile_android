import { UserModel } from '../../models';

export enum ACTION_TYPE {
  SET_CURRENT_USER = '[user] set current user'
}

export const actions = {
  setCurrentUser: (user: UserModel.IUser) => ({ type: ACTION_TYPE.SET_CURRENT_USER, payload: { user } })
};

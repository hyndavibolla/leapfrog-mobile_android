import { UserModel } from '../../models';

export interface IUserState {
  currentUser: UserModel.IUser;
}

export const initialState: IUserState = {
  currentUser: {
    firstName: '-',
    lastName: '',
    email: '-',
    avatarUrl: require('../../assets/shared/avatarFallbackInverted.png'),
    emailValidationStatus: UserModel.EmailStatus.APPROVED,
    sywUserId: '',
    personal: {
      sywMemberNumber: '',
      sywPinNumber: '',
      cellPhoneNumber: '-',
      searsUserId: null,
      homeAddress: {
        addressLine1: '-',
        addressLine2: '-',
        state: '-',
        stateOther: '-',
        city: '-',
        zip: '-',
        country: '-'
      },
      currentLocation: {
        zip: null,
        latitude: null,
        longitude: null
      }
    }
  }
};

export enum EmailStatus {
  APPROVED = 'A',
  SUSPENDED = 'S',
  PENDING = 'P'
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  emailValidationStatus: EmailStatus;
  sywUserId: string;
  personal: {
    sywMemberNumber: string;
    sywPinNumber: string;
    cellPhoneNumber: number | string;
    searsUserId: string;
    homeAddress: {
      addressLine1: string;
      addressLine2: string;
      state: string;
      stateOther: string;
      city: string;
      zip: number | string;
      country: string;
    };
    currentLocation: {
      zip: number | string;
      latitude: number;
      longitude: number;
    };
  };
}

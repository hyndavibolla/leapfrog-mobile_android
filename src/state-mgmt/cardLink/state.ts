import { ICardLinkOffer, ILinkedCard, ILocation } from '_models/cardLink';

export interface ICardLinkState {
  userId: string;
  offers: ICardLinkOffer[];
  linkedCardsList: ILinkedCard[];
  lastSearchedLocation: ILocation;
  isLocalOfferFailed: boolean;
  hasCalledLocalOffer: boolean; // to check if at least one time has been called getLocalOffers
  routeToActivateLocalOffer: string; // to activate the local offer after activated a new credit card
}

export const initialState: ICardLinkState = {
  userId: null,
  offers: [],
  linkedCardsList: [],
  lastSearchedLocation: null,
  isLocalOfferFailed: false,
  hasCalledLocalOffer: false,
  routeToActivateLocalOffer: ''
};

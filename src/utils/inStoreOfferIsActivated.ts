import moment from 'moment';
import { ICardLinkOffer } from '../models/cardLink';

export const inStoreOfferIsActivated = (offer: ICardLinkOffer): boolean => {
  /** @todo check against offer.status if it's available else use offer.activeUntil once we get that field back from API */
  // return offer.status === InStoreOfferStatus.ACTIVE;

  return moment(offer.activeUntil).isAfter();
};

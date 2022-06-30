import { CardLink } from '_models';

export enum ACTION_TYPE {
  SET_LOCAL_OFFERS = '[cardlink] set local offers',
  SET_LINKED_CARDS = '[core] set linked card list',
  SET_LAST_SEARCHED_LOCATION = '[cardlink] set last searched location',
  ACTIVATE_LOCAL_OFFER = '[cardlink] activate local offer',
  SET_LOCAL_OFFER_FAILED = '[cardlink] set isLocalOfferFailed',
  SET_HAS_CALLED_LOCAL_OFFER = '[cardlink] set hasCalledLocalOffer',
  SET_ROUTE_TO_ACTIVATE_LOCAL_OFFER = '[cardlink] set routeToActivateLocalOffer'
}

export const actions = {
  setLocalOffers: (localOffers: CardLink.ICardLinkOffers) => ({ type: ACTION_TYPE.SET_LOCAL_OFFERS, payload: localOffers }),
  setLinkedCards: (linkedCardsList: CardLink.ILinkedCard[]) => ({ type: ACTION_TYPE.SET_LINKED_CARDS, payload: { linkedCardsList } }),
  setLastSearchedLocation: (location: CardLink.ILocation) => ({ type: ACTION_TYPE.SET_LAST_SEARCHED_LOCATION, payload: { location } }),
  activateLocalOffer: (offerId: string) => ({ type: ACTION_TYPE.ACTIVATE_LOCAL_OFFER, payload: offerId }),
  setLocalOfferFailed: (isLocalOfferFailed: boolean) => ({ type: ACTION_TYPE.SET_LOCAL_OFFER_FAILED, payload: isLocalOfferFailed }),
  setHasCalledLocalOffer: (hasCalledLocalOffer: boolean) => ({ type: ACTION_TYPE.SET_HAS_CALLED_LOCAL_OFFER, payload: hasCalledLocalOffer }),
  setRouteToActivateLocalOffer: (routeToActivateLocalOffer: string) => ({
    type: ACTION_TYPE.SET_ROUTE_TO_ACTIVATE_LOCAL_OFFER,
    payload: routeToActivateLocalOffer
  })
};

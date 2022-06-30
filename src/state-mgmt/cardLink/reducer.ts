import moment from 'moment';
import { ENV } from '_constants';
import { InStoreOfferStatus } from '_models/cardLink';
import { IAction } from '_models/general';
import { ACTION_TYPE } from './actions';
import { ICardLinkState, initialState } from './state';

export const reducer = (state: ICardLinkState = initialState, { type, payload }: IAction): ICardLinkState => {
  switch (type) {
    case ACTION_TYPE.SET_LOCAL_OFFERS:
      return { ...state, userId: payload.userId, offers: payload.offers };
    case ACTION_TYPE.SET_LINKED_CARDS:
      return { ...state, linkedCardsList: payload.linkedCardsList };
    case ACTION_TYPE.SET_LAST_SEARCHED_LOCATION:
      return { ...state, lastSearchedLocation: payload.location };
    case ACTION_TYPE.ACTIVATE_LOCAL_OFFER:
      return {
        ...state,
        offers: state.offers.map(offer =>
          offer.offerId === payload
            ? {
                ...offer,
                status: InStoreOfferStatus.ACTIVE,
                activeUntil: moment().add(ENV.LOCAL_OFFERS.DEFAULT_ACTIVATION_DAYS, 'days').startOf('day').toDate()
              }
            : offer
        )
      };
    case ACTION_TYPE.SET_LOCAL_OFFER_FAILED:
      return { ...state, isLocalOfferFailed: payload };
    case ACTION_TYPE.SET_HAS_CALLED_LOCAL_OFFER:
      return { ...state, hasCalledLocalOffer: payload };
    case ACTION_TYPE.SET_ROUTE_TO_ACTIVATE_LOCAL_OFFER:
      return { ...state, routeToActivateLocalOffer: payload };
    default:
      return state;
  }
};

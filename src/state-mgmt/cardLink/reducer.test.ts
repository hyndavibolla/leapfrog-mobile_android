import moment from 'moment';

import { getLocalOffers_1, getLocalOffers_2 } from '_test_utils/entities';
import { InStoreOfferStatus } from '_models/cardLink';
import { ENV } from '_constants';

import { reducer } from './reducer';
import { initialState } from './state';
import { actions } from './actions';

describe('card link reducer', () => {
  it('should return the previous state when no switch case matches', () => {
    expect(reducer(undefined, { type: null, payload: null })).toBe(initialState);
  });

  it('should return a new state ', () => {
    expect(reducer(initialState, actions.setLocalOffers(getLocalOffers_1()))).toEqual({
      ...initialState,
      ...getLocalOffers_1()
    });
  });

  it('Should activate offer', () => {
    const offerToActivateId = getLocalOffers_2().offers[0].offerId;

    const expectedOfferSet = getLocalOffers_2();
    const expectedActivatedOffer = expectedOfferSet.offers.find(offer => offer.offerId === offerToActivateId);
    expectedActivatedOffer.status = InStoreOfferStatus.ACTIVE;
    expectedActivatedOffer.activeUntil = moment().add(ENV.LOCAL_OFFERS.DEFAULT_ACTIVATION_DAYS, 'days').startOf('day').toDate();

    const reducedOffers = reducer({ ...initialState, offers: getLocalOffers_2().offers }, actions.activateLocalOffer(offerToActivateId));
    expect(reducedOffers).toEqual({
      ...initialState,
      offers: expectedOfferSet.offers
    });
  });

  it('should return a new state SET_LOCAL_OFFER_FAILED', () => {
    expect(reducer({ ...initialState }, actions.setLocalOfferFailed(true))).toEqual({
      ...initialState,
      isLocalOfferFailed: true
    });
  });

  it('should return a new state SET_HAS_CALLED_LOCAL_OFFER', () => {
    expect(reducer({ ...initialState }, actions.setHasCalledLocalOffer(true))).toEqual({
      ...initialState,
      hasCalledLocalOffer: true
    });
  });

  it('should return a new state SET_ROUTE_TO_ACTIVATE_LOCAL_OFFER', () => {
    const route = 'routeTest';
    expect(reducer({ ...initialState }, actions.setRouteToActivateLocalOffer(route))).toEqual({
      ...initialState,
      routeToActivateLocalOffer: route
    });
  });
});

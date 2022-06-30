import { InStoreOfferStatus } from '../models/cardLink';
import { getLocalOffers_1 } from '../test-utils/entities';
import { inStoreOfferIsActivated } from './inStoreOfferIsActivated';

const dayInMSecs = 1000 * 60 * 60 * 24;

describe('inStoreOfferIsActivated', () => {
  it('returns true for active offers', () => {
    const offer = getLocalOffers_1().offers[0];
    offer.status = InStoreOfferStatus.ACTIVE;
    offer.activeUntil = Date.now() + dayInMSecs;

    expect(inStoreOfferIsActivated(offer)).toBe(true);
  });

  it('returns false for expired offers', () => {
    const offer = getLocalOffers_1().offers[0];
    offer.status = InStoreOfferStatus.INACTIVE;
    offer.activeUntil = Date.now() - dayInMSecs;

    expect(inStoreOfferIsActivated(offer)).toBe(false);
  });

  it('returns false for non-activated offers', () => {
    const offer = getLocalOffers_1().offers[0];
    offer.status = InStoreOfferStatus.INACTIVE;
    offer.activeUntil = undefined;

    expect(inStoreOfferIsActivated(offer)).toBe(false);
  });

  it('returns false for non-activated offers (degenerate: empty string activeUntil)', () => {
    const offer = getLocalOffers_1().offers[0];
    offer.status = InStoreOfferStatus.INACTIVE;
    offer.activeUntil = '';

    expect(inStoreOfferIsActivated(offer)).toBe(false);
  });
});

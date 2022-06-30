import { TransactionFilter } from '_models/offer';
import { ROUTES } from '_constants';
import { getNote, getRoute, getSubtitle, getTextButton, getTitle } from './transactionFiltersUtil';

describe('util fallback transactions', () => {
  it('should return the title for all transaction', () => {
    expect(getTitle(TransactionFilter.ALL_TRANSACTIONS)).toEqual('Hmm. Let’s get you some points!');
  });

  it('should return the title for rewards', () => {
    expect(getTitle(TransactionFilter.REWARDS)).toEqual('It’s time to reward yourself!');
  });

  it('should return the title for mastercard', () => {
    expect(getTitle(TransactionFilter.SYW_MASTERCARD)).toEqual('Earn more MAX points!');
  });

  it('should return the subtitle for all transaction', () => {
    expect(getSubtitle(TransactionFilter.ALL_TRANSACTIONS)).toEqual(
      'It doesn’t look like you’ve earned any points yet. Discover all the rewards waiting for you.'
    );
  });

  it('should return the subtitle for rewards', () => {
    expect(getSubtitle(TransactionFilter.REWARDS)).toEqual('It doesn’t look like you’ve used any points yet. Discover all the rewards waiting for you.');
  });

  it('should return the subtitle for mastercard', () => {
    expect(getSubtitle(TransactionFilter.SYW_MASTERCARD)).toEqual(
      'When you use your Shop Your Way Mastercard®, you earn points. But it looks like you’ve been missing out. Discover all the rewards waiting for you.'
    );
  });

  it('should return the text button for all transaction', () => {
    expect(getTextButton(TransactionFilter.ALL_TRANSACTIONS)).toEqual('Start Earning!');
  });

  it('should return the text button for rewards', () => {
    expect(getTextButton(TransactionFilter.REWARDS)).toEqual('Go to Rewards');
  });

  it('should return the text button for mastercard', () => {
    expect(getTextButton(TransactionFilter.SYW_MASTERCARD)).toEqual('Start Earning!');
  });

  it('should return the route for all transaction', () => {
    expect(getRoute(TransactionFilter.ALL_TRANSACTIONS)).toEqual(ROUTES.MAIN_TAB.EARN);
  });

  it('should return the route for rewards', () => {
    expect(getRoute(TransactionFilter.REWARDS)).toEqual(ROUTES.MAIN_TAB.REWARDS);
  });

  it('should return the route for mastercard', () => {
    expect(getRoute(TransactionFilter.SYW_MASTERCARD)).toEqual(ROUTES.MAIN_TAB.EARN);
  });

  it('should return the route for missions', () => {
    expect(getRoute(TransactionFilter.MISSIONS)).toEqual(ROUTES.MAIN_TAB.STREAK);
  });

  it('should return the note text for all transaction', () => {
    expect(getNote(TransactionFilter.ALL_TRANSACTIONS)).toEqual('Most users love these');
  });

  it('should return the note text for missions', () => {
    expect(getNote(TransactionFilter.MISSIONS)).toEqual('Participating Brands');
  });

  it('should return the note text for local offers', () => {
    expect(getNote(TransactionFilter.LOCAL_OFFERS)).toEqual('Participating Brands');
  });

  it('should return the note text for rewards', () => {
    expect(getNote(TransactionFilter.REWARDS)).toEqual('Most Popular Gift Cards');
  });

  it('should return the note text for mastercard', () => {
    expect(getNote(TransactionFilter.SYW_MASTERCARD)).toEqual('Most users love these');
  });
});

import { reducer } from './reducer';
import { initialState } from './state';
import { actions } from './actions';
import { getGiftCard } from '_test_utils/entities';
import { statusType } from '_models/giftCard';

describe('gift card reducer', () => {
  it('should return the previous state when no switch case matches', () => {
    expect(reducer(undefined, { type: null, payload: null })).toBe(initialState);
  });

  it('should return a new state ', () => {
    expect(reducer(initialState, actions.setGiftCardList([getGiftCard()]))).toEqual({
      ...initialState,
      giftCardsList: [getGiftCard()]
    });
  });

  it('should update gift card status ', () => {
    const giftCard = { ...getGiftCard(), providerCardId: '93ed4685-fa5e-465e-a2ba-217a3903f288' };
    initialState.giftCardsList = [getGiftCard(), giftCard];
    expect(reducer(initialState, actions.setGiftCardStatus(getGiftCard().providerCardId, statusType.HIDDEN))).toEqual({
      giftCardsList: [{ ...getGiftCard(), statusInd: statusType.HIDDEN }, giftCard]
    });
  });
});

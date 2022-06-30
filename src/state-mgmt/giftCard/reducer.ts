import { IAction } from '_models/general';
import { ACTION_TYPE } from './actions';
import { IGiftCardState, initialState } from './state';

export const reducer = (state: IGiftCardState = initialState, { type, payload }: IAction): IGiftCardState => {
  switch (type) {
    case ACTION_TYPE.SET_GIFT_CARDS_LIST:
      return { ...state, giftCardsList: payload.giftCardsList };
    case ACTION_TYPE.SET_GIFT_CARDS_STATUS:
      return {
        ...state,
        giftCardsList: state.giftCardsList.map(giftCard => (giftCard.providerCardId === payload.id ? { ...giftCard, statusInd: payload.statusInd } : giftCard))
      };
    default:
      return state;
  }
};

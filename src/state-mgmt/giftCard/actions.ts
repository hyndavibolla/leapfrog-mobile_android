import { IGiftCard } from '_models/giftCard';
import { statusType } from '_models/giftCard';

export enum ACTION_TYPE {
  SET_GIFT_CARDS_LIST = '[core] set gift cards list',
  SET_GIFT_CARDS_STATUS = '[core] set gift cards status'
}

export const actions = {
  setGiftCardList: (giftCardsList: IGiftCard[]) => ({ type: ACTION_TYPE.SET_GIFT_CARDS_LIST, payload: { giftCardsList } }),
  setGiftCardStatus: (id: string, statusInd: statusType) => ({ type: ACTION_TYPE.SET_GIFT_CARDS_STATUS, payload: { id, statusInd } })
};

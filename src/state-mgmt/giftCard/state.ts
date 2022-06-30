import { IGiftCard } from '_models/giftCard';

export interface IGiftCardState {
  giftCardsList: IGiftCard[];
}

export const initialState: IGiftCardState = {
  giftCardsList: []
};

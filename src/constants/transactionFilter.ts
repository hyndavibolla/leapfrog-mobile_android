import { TransactionFilter } from '_models/offer';

export const numberOfItemsToShow: number = 10;
export const numberOfBubbles: number = 4;

export const transactionFilterMenuItems = [
  { title: 'All transactions', filter: TransactionFilter.ALL_TRANSACTIONS },
  { title: 'Local offers', filter: TransactionFilter.LOCAL_OFFERS },
  { title: 'Missions', filter: TransactionFilter.MISSIONS },
  { title: 'Rewards', filter: TransactionFilter.REWARDS },
  { title: 'SYW Mastercard', filter: TransactionFilter.SYW_MASTERCARD }
];

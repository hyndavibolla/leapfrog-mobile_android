import { TransactionFilter } from '_models/offer';
import { ROUTES } from '_constants';

export function getTitle(transactionType: TransactionFilter): string {
  switch (transactionType) {
    case TransactionFilter.ALL_TRANSACTIONS:
    case TransactionFilter.LOCAL_OFFERS:
    case TransactionFilter.MISSIONS:
      return 'Hmm. Let’s get you some points!';
    case TransactionFilter.REWARDS:
      return 'It’s time to reward yourself!';
    case TransactionFilter.SYW_MASTERCARD:
      return 'Earn more MAX points!';
  }
}

export function getSubtitle(transactionType: TransactionFilter): string {
  switch (transactionType) {
    case TransactionFilter.ALL_TRANSACTIONS:
    case TransactionFilter.LOCAL_OFFERS:
    case TransactionFilter.MISSIONS:
      return 'It doesn’t look like you’ve earned any points yet. Discover all the rewards waiting for you.';
    case TransactionFilter.REWARDS:
      return 'It doesn’t look like you’ve used any points yet. Discover all the rewards waiting for you.';
    case TransactionFilter.SYW_MASTERCARD:
      return 'When you use your Shop Your Way Mastercard®, you earn points. But it looks like you’ve been missing out. Discover all the rewards waiting for you.';
  }
}

export function getTextButton(transactionType: TransactionFilter): string {
  switch (transactionType) {
    case TransactionFilter.ALL_TRANSACTIONS:
    case TransactionFilter.LOCAL_OFFERS:
    case TransactionFilter.MISSIONS:
      return 'Start Earning!';
    case TransactionFilter.REWARDS:
      return 'Go to Rewards';
    case TransactionFilter.SYW_MASTERCARD:
      return 'Start Earning!';
  }
}

export function getRoute(transactionType: TransactionFilter): string {
  switch (transactionType) {
    case TransactionFilter.ALL_TRANSACTIONS:
    case TransactionFilter.LOCAL_OFFERS:
    case TransactionFilter.SYW_MASTERCARD:
      return ROUTES.MAIN_TAB.EARN;
    case TransactionFilter.MISSIONS:
      return ROUTES.MAIN_TAB.STREAK;
    case TransactionFilter.REWARDS:
      return ROUTES.MAIN_TAB.REWARDS;
  }
}

export function getNote(transactionType: TransactionFilter): string {
  switch (transactionType) {
    case TransactionFilter.ALL_TRANSACTIONS:
      return 'Most users love these';
    case TransactionFilter.MISSIONS:
    case TransactionFilter.LOCAL_OFFERS:
      return 'Participating Brands';
    case TransactionFilter.REWARDS:
      return 'Most Popular Gift Cards';
    case TransactionFilter.SYW_MASTERCARD:
      return 'Most users love these';
  }
}

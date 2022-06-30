import moment from 'moment';
import { DateLike } from '_models/general';

export const getFormattedCheckBalanceDate = (date: DateLike) => {
  const normalizedDate = moment(date);
  if (normalizedDate.isSame(moment(), 'day')) return 'Today';

  const diffInDays = moment().diff(normalizedDate, 'days');
  const yesterdayDiff = 2;
  return diffInDays < yesterdayDiff ? 'Yesterday' : `${diffInDays}d ago`;
};

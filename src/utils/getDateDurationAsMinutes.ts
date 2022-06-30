import moment from 'moment';
import { DateLike } from '../models/general';

export const getDateDurationAsMinutes = (savedDate: DateLike): number => {
  const currentDate = moment();
  return moment.duration(currentDate.diff(moment(savedDate))).asMinutes();
};

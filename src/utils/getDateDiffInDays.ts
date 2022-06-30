import moment from 'moment';
import { DateLike } from '../models/general';

export const getDateDiffInDays = (startDate: DateLike, endDate: DateLike): number => {
  return moment(endDate).utc().startOf('day').diff(moment(startDate).utc().startOf('day'), 'days');
};

import moment from 'moment';
import { DateLike } from '_models/general';

export const getIsSameDate = (dateOne: DateLike, dateTwo: DateLike) => moment(dateOne).isSame(dateTwo);

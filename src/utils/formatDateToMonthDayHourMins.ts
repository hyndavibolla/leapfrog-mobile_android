import moment from 'moment';

export const formatDateToMonthDayHourMins = (date: string | number | Date): string => {
  return date ? moment(date).format('MMM Do - hh:mm a') : '';
};

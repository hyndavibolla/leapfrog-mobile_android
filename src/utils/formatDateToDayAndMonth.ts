import moment from 'moment';

export const formatDateToDayAndMonth = (date: string | number | Date): string => {
  return date ? moment(date).format('MMMM Do') : '';
};

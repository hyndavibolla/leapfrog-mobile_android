import moment from 'moment';

export const getFormattedTimeDiff = (to: number | string | Date, from: number | string | Date): string => {
  return moment.duration(moment(from).diff(to)).humanize();
};

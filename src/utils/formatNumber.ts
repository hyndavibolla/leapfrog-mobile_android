import { ENV } from '../constants';

export const formatNumber = (num: number): string => num?.toLocaleString(ENV.LOCALE);

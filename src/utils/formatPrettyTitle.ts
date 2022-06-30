import { capitalize } from './capitalize';

export const formatPrettyTitle = (str: string, lowerCaseWordList = ['and', 'or', 'a', 'of', 'with', 'without']): string => {
  return (str || '')
    .split(/\s|-|_/)
    .map(word => word.trim().toLowerCase())
    .map((word, index) => (!lowerCaseWordList.includes(word) || !index ? capitalize(word) : word))
    .filter(Boolean)
    .join(' ');
};

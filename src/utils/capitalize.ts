export const capitalize = (str: string) => {
  str = str || '';
  return `${str.charAt(0).toUpperCase()}${str.substring(1, str.length).toLocaleLowerCase()}`;
};

export const normalizeTextForSearching = (txt: string): string => {
  return String(txt || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/([\u0300-\u036f])|(\s+)|(\W)|(_)+/gi, '');
};

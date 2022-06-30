export const isNumeric = (possibleNumber: string): boolean => {
  return !isNaN(possibleNumber as any) && !isNaN(parseFloat(possibleNumber));
};

export const getFixedValueWithDecimals = (number: number, decimals: number): string => {
  return number.toFixed(number % 1 === 0 ? 0 : decimals);
};

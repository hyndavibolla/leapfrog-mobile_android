export const hexToRgba = (hex: string, alpha?: number): string => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const parsedHex = hex.replace(shorthandRegex, (_, r: string, g: string, b: string) => `${r}${r}${g}${g}${b}${b}`);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(parsedHex);
  return !result ? null : `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha ?? 1})`;
};

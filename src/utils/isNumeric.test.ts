import { isNumeric } from './isNumeric';

describe('isNumeric', () => {
  it('should return true for numeric values', () => {
    expect(isNumeric('123')).toBe(true);
    expect(isNumeric('123.5')).toBe(true);
    expect(isNumeric('0')).toBe(true);
    expect(isNumeric('-50')).toBe(true);
    expect(isNumeric('-1')).toBe(true);
    expect(isNumeric('-1.5')).toBe(true);
  });

  it('should return false for non-numeric values', () => {
    expect(isNumeric(undefined)).toBe(false);
    expect(isNumeric(null)).toBe(false);
    expect(isNumeric('')).toBe(false);
    expect(isNumeric('a')).toBe(false);
    expect(isNumeric('0a')).toBe(false);
    expect(isNumeric('a0')).toBe(false);
    expect(isNumeric('1-1')).toBe(false);
    expect(isNumeric('1-1')).toBe(false);
    expect(isNumeric('+1-0')).toBe(false);
  });
});

import { safeMin } from './safeMin';

describe('safeMin', () => {
  it('should return the min', () => {
    expect(safeMin(4, 7, 3)).toEqual(3);
  });

  it('should return the min when args contain NaN', () => {
    expect(safeMin(4, NaN, 3)).toEqual(3);
  });

  it('should return 0 when all args are NaN', () => {
    expect(safeMin(NaN)).toEqual(0);
  });
});

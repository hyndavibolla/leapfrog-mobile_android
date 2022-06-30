import { splitArrayInChunks } from './splitArrayInChunks';

describe('splitArrayInChunks', () => {
  it('should split', () => {
    const array = [1, 2, 3, 4, 5, 6];
    expect(splitArrayInChunks<number>(array)).toEqual([[1], [2], [3], [4], [5], [6]]);
  });

  it('should handle undefined args', () => {
    const array = undefined;
    expect(splitArrayInChunks<number>(array)).toEqual([]);
  });

  it('should split with even chunk size', () => {
    const array = [1, 2, 3, 4, 5, 6];
    expect(splitArrayInChunks<number>(array, 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6]
    ]);
  });

  it('should split with odd chunk size', () => {
    const array = [1, 2, 3, 4, 5, 6, 7];
    expect(splitArrayInChunks<number>(array, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });
});

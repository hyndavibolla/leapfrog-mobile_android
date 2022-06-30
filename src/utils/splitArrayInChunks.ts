export const splitArrayInChunks = <T>(array: T[] = [], chunkSize: number = 1): T[][] =>
  array.map((_, i) => (i % chunkSize === 0 ? array.slice(i, i + chunkSize) : undefined)).filter(c => c !== undefined);

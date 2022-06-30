export const safeMin = (...args: number[]) => {
  const safeArgs = args.filter(n => !isNaN(n));
  return safeArgs.length ? Math.min(...safeArgs) : 0;
};

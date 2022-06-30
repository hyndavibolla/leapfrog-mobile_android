export const memorize = <T>(fn: T, maxCacheSize: number = 500, cacheDuration: number = 0): T & [T, () => void] => {
  let cache: { [key: string]: any } = {};
  let interval: any;
  if (cacheDuration) interval = setInterval(() => (cache = {}), cacheDuration);
  const wrapped = function (...args: any[]) {
    const key: string = JSON.stringify(args);
    if (cache[key] !== undefined) return cache[key];
    try {
      return (cache[key] = (fn as any)(...args));
    } finally {
      const keys = Object.keys(cache);
      if (keys.length > maxCacheSize) delete cache[keys[0]];
    }
  } as any;
  return cacheDuration ? [wrapped, () => clearInterval(interval)] : wrapped;
};

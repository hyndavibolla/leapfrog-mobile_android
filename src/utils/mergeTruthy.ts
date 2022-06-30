const isObject = (v: any) => typeof v === 'object' && v !== null && !Array.isArray(v);

export const mergeTruthy = <T>(a: T, b: T, isTruthy = (arg: any) => typeof arg === 'number' || !!arg): T => {
  const shouldLoop = isObject(a) && isObject(b);
  if (!shouldLoop) return isTruthy(b) ? b : a;
  const keyList = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));

  return keyList.reduce((total, key) => {
    total[key] = mergeTruthy(a[key], b[key], isTruthy);
    return total;
  }, {}) as T;
};

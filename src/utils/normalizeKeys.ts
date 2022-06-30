export const normalizeKeys = (() => {
  const shouldLoop = (arg: any): boolean => !!arg && (arg instanceof Array || typeof arg === 'object');
  const renameKey = (key: string) => {
    if (/^(|\s|_|-)ID$/i.test(key.split(/\s|-|_/).reverse()[0])) return 'id';
    return key
      .split(/\s|-|_/)
      .map((partial, index) => `${partial.charAt(0)[index ? 'toUpperCase' : 'toLowerCase']()}${partial.slice(1, partial.length)}`)
      .join('');
  };
  return <T = any>(value: any): T => {
    if (!shouldLoop(value)) return value;
    const isArray = Array.isArray(value);
    return Object.entries(value).reduce(
      (total, [k, v]) => (isArray ? [...total, normalizeKeys(v)] : { ...total, [renameKey(k)]: normalizeKeys(v) }),
      (isArray ? [] : {}) as any
    );
  };
})();

export const removeKeyList = <ResultingObject>(obj: { [key: string]: any }, keyList: string[]): ResultingObject =>
  Object.entries(obj)
    .filter(([key]) => !keyList.includes(key))
    .reduce((total, [key, value]) => ({ ...total, [key]: value }), {}) as ResultingObject;

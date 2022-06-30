export const getLogArgs = (argList: any[]) => {
  const [firstArg, ...rest] = argList;
  const error = firstArg instanceof Error ? firstArg : new Error(firstArg);

  const metadata = rest.reduce(
    ({ total, unnamedCount }, element) => {
      const shouldConvertToObject = typeof element !== 'object' || element instanceof Array || element === null;
      const newCount = shouldConvertToObject ? unnamedCount + 1 : unnamedCount;
      const object = shouldConvertToObject ? { [`unnamed_${newCount}`]: element } : element;
      const newTotal = Object.entries(object).reduce((partial, [k, v]) => ({ ...partial, [k in partial ? `${k}_2` : k]: v }), total);
      return { total: newTotal, unnamedCount: newCount };
    },
    { total: {}, unnamedCount: 0 }
  ).total;

  return { error, metadata };
};

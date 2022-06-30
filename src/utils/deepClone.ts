const getType = (variable: any): string => {
  let type: string = typeof variable;
  type = variable === null ? 'null' : type;
  type = Array.isArray(variable) ? 'array' : type;
  return type;
};

const clone = <T>(variable: any): T => {
  let copy: T;
  const variableType: string = getType(variable);

  if (variableType === 'object') copy = { ...variable };
  else if (variableType === 'array') copy = variable.slice();
  else copy = variable;

  return copy as T;
};

export const deepClone = <T>(variable: T): T => {
  const result: T = clone(variable) as T;

  const loop = (value: any): any => {
    const valueType: string = getType(value);
    const loopHandler = (index: string | number) => {
      value[index] = clone(value[index]);
      loop(value[index]);
    };

    if (valueType === 'object') for (const index in value) loopHandler(index);
    if (valueType === 'array') for (let index = 0; index < value.length; index++) loopHandler(index);
  };

  loop(result);

  return result as T;
};

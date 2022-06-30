export const listToMap = <T>(list: T[], map: { [key: string]: T } = {}, keyField = 'id'): Record<string, T> =>
  list.reduce((total: { [key: string]: T }, item: T) => ({ ...total, [item[keyField]]: item }), map);

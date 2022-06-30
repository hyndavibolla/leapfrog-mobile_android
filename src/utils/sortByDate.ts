export const sortByDate = (key?: string) => (a: any, b: any) =>
  String(new Date(key ? a[key] : a).getTime()).localeCompare(String(new Date(key ? b[key] : b).getTime()));

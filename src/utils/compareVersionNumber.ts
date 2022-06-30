export const compareVersionNumber = (version1: string, version2: string) => {
  const [major1, minor1, patch1] = version1.split('.');
  const [major2, minor2, patch2] = version2.split('.');

  if (Number(major1) > Number(major2)) return 1;
  if (Number(major1) < Number(major2)) return -1;

  if (Number(minor1) > Number(minor2)) return 1;
  if (Number(minor1) < Number(minor2)) return -1;

  if (Number(patch1) > Number(patch2)) return 1;
  if (Number(patch1) < Number(patch2)) return -1;

  return 0;
};

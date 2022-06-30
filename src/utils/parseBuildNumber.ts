export const parseBuildNumber = (readable: string): number => Number(readable.replace(/\./g, ''));

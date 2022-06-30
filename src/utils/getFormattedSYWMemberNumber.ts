export const getFormattedSYWMemberNumber = (sywMemberNumber: string): string => {
  return sywMemberNumber ? sywMemberNumber.match(/.{1,4}/g).join(' ') : '';
};

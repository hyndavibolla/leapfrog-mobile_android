import { getFormattedSYWMemberNumber } from './getFormattedSYWMemberNumber';

describe('getFormattedSYWMemberNumber', () => {
  it('should add a space every four characters', () => {
    expect(getFormattedSYWMemberNumber('3657383888179648446')).toEqual('3657 3838 8817 9648 446');
  });

  it('should return an empty string', () => {
    expect(getFormattedSYWMemberNumber('')).toEqual('');
  });
});

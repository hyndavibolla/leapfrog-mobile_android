import { prepareTermForReg } from './prepareTermForReg';

describe('prepareTermForReg', () => {
  it('should return valid strings to be used in regular expressions', () => {
    expect(prepareTermForReg(null)).toEqual('');
    expect(prepareTermForReg('+')).toEqual('\\+');
    expect(prepareTermForReg('a')).toEqual('a');
  });
});

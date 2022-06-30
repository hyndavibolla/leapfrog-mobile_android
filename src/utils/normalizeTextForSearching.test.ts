import { normalizeTextForSearching } from './normalizeTextForSearching';

describe('normalizeTextForSearching', () => {
  it('should remove empty spaces', () => {
    expect(normalizeTextForSearching('hello with a lot of     spaces')).toEqual('hellowithalotofspaces');
  });

  it('should remove caps', () => {
    expect(normalizeTextForSearching('HeLlO')).toEqual('hello');
  });

  it('should remove accents', () => {
    expect(normalizeTextForSearching('hèlló')).toEqual('hello');
  });

  it('should remove special chars', () => {
    expect(normalizeTextForSearching('1&2-3_4.5')).toEqual('12345');
  });

  it('should not crash on empty strings', () => {
    expect(normalizeTextForSearching(null)).toEqual('');
  });
});

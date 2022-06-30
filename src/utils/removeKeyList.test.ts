import { removeKeyList } from './removeKeyList';

describe('removeKeyList', () => {
  it('should remove a list of keys from an object', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    const removed = removeKeyList(obj, ['b', 'c']);
    expect(removed).toEqual({ a: 1, d: 4 });
    expect(obj).not.toBe(removed);
  });

  it('should ignore non existing keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    expect(removeKeyList(obj, ['e'])).toEqual(obj);
  });
});

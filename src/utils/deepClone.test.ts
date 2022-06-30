import { deepClone } from './deepClone';

describe('deepClone', () => {
  it('should clone a variable', async () => {
    const shallow = { a: 1 };
    const copy = deepClone(shallow);
    expect(shallow).toEqual(copy);
    expect(shallow).not.toBe(copy);
  });

  it('should deep clone a variable', async () => {
    const deep = { a: 1, b: { c: 3, d: [1, 2, 3], e: null } };
    const copy = deepClone(deep);
    expect(deep).toEqual(copy);
    expect(deep).not.toBe(copy);
  });
});

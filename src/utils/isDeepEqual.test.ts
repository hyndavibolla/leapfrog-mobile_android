import { isDeepEqual } from './isDeepEqual';

describe('isDeepEqual', () => {
  it('should compare simple vars', () => {
    expect(isDeepEqual(true, true)).toEqual(true);
    expect(isDeepEqual(true, false)).toEqual(false);
    expect(isDeepEqual(1, 1)).toEqual(true);
    expect(isDeepEqual(1, 2)).toEqual(false);
    expect(isDeepEqual('a', 'a')).toEqual(true);
    expect(isDeepEqual('a', 'b')).toEqual(false);
    expect(isDeepEqual(null, null)).toEqual(true);
    expect(isDeepEqual(NaN, NaN)).toEqual(false);
  });

  it('should simple objects and arrays', () => {
    expect(isDeepEqual([], [])).toEqual(true);
    expect(isDeepEqual([1], [1])).toEqual(true);
    expect(isDeepEqual([1], [2])).toEqual(false);
    expect(isDeepEqual({}, {})).toEqual(true);
    expect(isDeepEqual({ a: 1 }, { a: 1 })).toEqual(true);
    expect(isDeepEqual({ a: 1 }, { a: 2 })).toEqual(false);
  });

  it('should complex objects and arrays', () => {
    const a = { a: 1, b: { c: 2, d: [1, 2, { e: 5 }] } };
    const b = { a: 1, b: { c: 2, d: [1, 2, { e: 5 }] } };
    expect(isDeepEqual(a, b)).toEqual(true);

    const d = { a: 1, b: { c: 2, d: [1, 2, { e: 5 }] } };
    const e = { a: 1, b: { c: 2, d: [1, 250, { e: 5 }] } };
    expect(isDeepEqual(d, e)).toEqual(false);
    expect(isDeepEqual(d, d)).toEqual(true);

    const f = { a: 1, b: { c: 2, d: [1, 2, { e: 5 }] }, f: null };
    const g = { a: 1, b: { c: 2, d: [1, 2, { e: 5 }] } };
    expect(isDeepEqual(f, g)).toEqual(false);
  });
});

import { getLogArgs } from './getLogArgs';

describe('getLogArgs', () => {
  it('should get log when arg list is empty', () => {
    const argList = [];
    expect(getLogArgs(argList)).toEqual({ error: expect.any(Error), metadata: {} });
  });

  it('should get log when first arg is an Error', () => {
    const error = new Error();
    const argList = [error];
    expect(getLogArgs(argList)).toEqual({ error, metadata: {} });
  });

  it('should get log when first arg is NOT an Error', () => {
    const error = 'error message';
    const argList = [error];
    expect(getLogArgs(argList).error.message).toEqual('error message');
  });

  it('should get log when there are many types of argument', () => {
    const argList = ['error', 'description', 1, { a: 2 }, [3, 4, 5], { nested1: { nested2: [6, 7, 8] } }, { a: 9 }, null];
    expect(getLogArgs(argList)).toEqual({
      error: expect.any(Error),
      metadata: {
        unnamed_1: 'description',
        a: 2,
        a_2: 9,
        unnamed_2: 1,
        unnamed_3: [3, 4, 5],
        nested1: { nested2: [6, 7, 8] },
        unnamed_4: null
      }
    });
  });
});

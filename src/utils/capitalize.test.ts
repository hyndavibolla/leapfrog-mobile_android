import { capitalize } from './capitalize';

describe('capitalize', () => {
  it('should capitalize', () => {
    expect(capitalize('hello')).toEqual('Hello');
    expect(capitalize(null)).toEqual('');
  });
});

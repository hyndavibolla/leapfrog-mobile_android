import { noop } from './noop';

describe('noop', () => {
  it('should do nothing we know of without crashing', () => {
    expect(noop()).toEqual(undefined);
  });
});

import { parseBuildNumber } from './parseBuildNumber';

describe('parseBuildNumber', () => {
  it('should parse build number', () => {
    expect(parseBuildNumber('1.0.2.2')).toEqual(1022);
  });
});

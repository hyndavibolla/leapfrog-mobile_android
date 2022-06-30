import { compareVersionNumber } from './compareVersionNumber';

describe('compareVersionNumber', () => {
  it('should be greater', () => {
    expect(compareVersionNumber('2.0.0', '1.0.0')).toEqual(1);
    expect(compareVersionNumber('1.2.0', '1.0.0')).toEqual(1);
    expect(compareVersionNumber('1.0.2', '1.0.0')).toEqual(1);
  });

  it('should be lower', () => {
    expect(compareVersionNumber('1.0.0', '2.0.0')).toEqual(-1);
    expect(compareVersionNumber('1.0.0', '1.2.0')).toEqual(-1);
    expect(compareVersionNumber('1.0.0', '1.0.2')).toEqual(-1);
  });

  it('should be same', () => {
    expect(compareVersionNumber('1.0.0', '1.0.0')).toEqual(0);
  });
});

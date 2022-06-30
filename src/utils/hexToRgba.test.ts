import { hexToRgba } from './hexToRgba';
import { COLOR } from '../constants';

describe('hexToRgba', () => {
  it('should get rgba without defined alpha', () => {
    expect(hexToRgba(COLOR.PRIMARY_BLUE)).toEqual('rgba(0, 102, 204, 1)');
  });

  it('should get rgba with short HEX', () => {
    expect(hexToRgba('#06C')).toEqual('rgba(0, 102, 204, 1)');
  });

  it('should get rgba with HEX without #', () => {
    expect(hexToRgba('06C')).toEqual('rgba(0, 102, 204, 1)');
  });

  it('should get rgba with defined alpha', () => {
    expect(hexToRgba(COLOR.PRIMARY_BLUE, 0.45)).toEqual('rgba(0, 102, 204, 0.45)');
  });

  it('should get null if not a valid HEX ', () => {
    expect(hexToRgba('13')).toEqual(null);
  });
});

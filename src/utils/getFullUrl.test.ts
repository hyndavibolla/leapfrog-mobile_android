import { getFullUrl } from './getFullUrl';

describe('getFullUrl', () => {
  it('should add the params in the url', () => {
    expect(getFullUrl('missions/tooltip', { step: 1 })).toEqual('missions/tooltip/1');
  });

  it('should return the url without params if the params are undefined', () => {
    expect(getFullUrl('missions/tooltip', undefined)).toEqual('missions/tooltip');
  });

  it('should return the url without params if the params are not set in ROUTES_PARAMS', () => {
    expect(getFullUrl('terms-and-conditions', { step: 2 })).toEqual('terms-and-conditions');
  });

  it('should return the url without params if the passed param does not exist in the array of ROUTES_PARAMS for this screen', () => {
    expect(getFullUrl('missions/tooltip', { otherParam: 1 })).toEqual('missions/tooltip');
  });
});

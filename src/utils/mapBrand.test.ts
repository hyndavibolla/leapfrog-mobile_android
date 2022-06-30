import { getBrandName } from './mapBrand';

describe('mapBrand', () => {
  it('should return mapped brand name if found', () => {
    expect(getBrandName('AllPosters.com')).toEqual('AllPosters');
  });

  it('should return brand name if not found', () => {
    expect(getBrandName('BrandNotFound')).toEqual('BrandNotFound');
  });
});

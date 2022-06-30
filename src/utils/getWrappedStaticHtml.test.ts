import { getWrappedHtml } from './getWrappedStaticHtml';

describe('getWrappedHtml', () => {
  it('should return wrapper static html', async () => {
    expect(getWrappedHtml('str')).toEqual(expect.stringContaining('str'));
  });
});

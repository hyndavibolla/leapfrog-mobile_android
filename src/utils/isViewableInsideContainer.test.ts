import { isViewableInsideContainer } from './isViewableInsideContainer';

describe('isViewableInsideContainer', () => {
  it('should return true when 2 views collapse', () => {
    const result = isViewableInsideContainer({ x: 0, y: 0, width: 50, height: 50 }, { x: 0, y: 0, width: 150, height: 1000 });
    expect(result).toBeTruthy();
  });

  it('should return false when 2 views do not collapse', () => {
    const result = isViewableInsideContainer({ x: 0, y: 0, width: 50, height: 50 }, { x: 0, y: 100, width: 150, height: 1000 });
    expect(result).toBeFalsy();
  });
});

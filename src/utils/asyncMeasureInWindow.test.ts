import { asyncMeasureInWindow } from './asyncMeasureInWindow';

describe('asyncMeasureInWindow', () => {
  it('should return the measurements of the view', async () => {
    const result = await asyncMeasureInWindow({ measureInWindow: jest.fn(cb => cb(0, 0, 0, 0)) } as any);
    expect(result).toMatchObject({ x: 0, y: 0, width: 0, height: 0 });
  });
});

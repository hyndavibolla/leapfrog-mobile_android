import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-native';
import { ENV } from '../constants';

import { useViewableViewList } from './useViewableViewList';
import { wait } from './wait';

describe('useViewableMissions', () => {
  let container = { measureInWindow: jest.fn(cb => cb(0, 0, 160, 700)) } as any;
  let items = { a: { measureInWindow: jest.fn(cb => cb(0, 0, 80, 80)) } } as any;
  let props = { time: ENV.MISSION_TRACKING.TIME_THRESHOLD, visibility: ENV.MISSION_TRACKING.VISIBILITY_THRESHOLD, focus: true };

  beforeEach(() => {
    container = { measureInWindow: jest.fn(cb => cb(0, 0, 160, 700)) };
    items = { a: { measureInWindow: jest.fn(cb => cb(0, 0, 80, 80)) } };
    props = { time: ENV.MISSION_TRACKING.TIME_THRESHOLD, visibility: ENV.MISSION_TRACKING.VISIBILITY_THRESHOLD, focus: true };
  });

  it('should return viewable missions', async () => {
    const { result } = renderHook(({ time, visibility, focus }) => useViewableViewList(time, visibility, focus), { initialProps: props });
    result.current[2].current = container;
    result.current[3]('a', items.a);
    await act(async () => {
      await result.current[1]();
      await wait(0);
    });
    expect(result.current[0]).toContain('a');
  });

  it('should return missions when not focused', () => {
    const { result } = renderHook(({ time, visibility, focus }) => useViewableViewList(time, visibility, focus), {
      initialProps: { ...props, focus: false }
    });
    result.current[2].current = container;
    result.current[3]('a', items.a);
    expect(result.current[0]).toHaveLength(0);
  });

  it('should stop tracking missions that are not visible before the time threshold 1', async () => {
    const { result } = renderHook(({ time, visibility, focus }) => useViewableViewList(time, visibility, focus), { initialProps: props });
    result.current[2].current = container;
    result.current[3]('a', items.a);
    await act(async () => {
      await result.current[1]();
      result.current[3]('a', { measureInWindow: jest.fn(cb => cb(-80, 0, 80, 80)) } as any);
      await result.current[1]();
      await wait(0);
    });
    expect(result.current[0]).not.toContain('a');
  });

  it('should stop tracking missions that are not visible before the time threshold 2', async () => {
    const { result } = renderHook(({ time, visibility, focus }) => useViewableViewList(time, visibility, focus), { initialProps: props });
    result.current[2].current = container;
    result.current[3]('a', items.a);
    await act(async () => {
      await result.current[1]();
      result.current[3]('a', { measureInWindow: jest.fn(cb => cb(-80, 0, 80, 80)) } as any);
      await wait(0);
    });
    expect(result.current[0]).not.toContain('a');
  });

  it('should stop tracking missions that are not visible anymore', async () => {
    const { result } = renderHook(({ time, visibility, focus }) => useViewableViewList(time, visibility, focus), { initialProps: props });
    result.current[2].current = container;
    result.current[3]('a', items.a);
    await act(async () => {
      await result.current[1]();
      await wait(0);
    });
    expect(result.current[0]).toContain('a');
    await act(async () => {
      result.current[3]('a', { measureInWindow: jest.fn(cb => cb(-80, 0, 80, 80)) } as any);
      await result.current[1]();
      await wait(0);
    });
    expect(result.current[0]).not.toContain('a');
  });

  it('should do nothing if the mission was visible and it still is', async () => {
    const { result } = renderHook(({ time, visibility, focus }) => useViewableViewList(time, visibility, focus), { initialProps: props });
    result.current[2].current = container;
    result.current[3]('a', items.a);
    await act(async () => {
      await result.current[1]();
      await wait(0);
    });
    expect(result.current[0]).toContain('a');
    await act(async () => {
      await result.current[1]();
      await wait(0);
    });
    expect(result.current[0]).toContain('a');
  });

  it('should clear missions and timers after losing focus', async () => {
    const { result, rerender } = renderHook(({ time, visibility, focus }) => useViewableViewList(time, visibility, focus), { initialProps: props });
    result.current[2].current = container;
    result.current[3]('a', items.a);
    await act(async () => {
      await result.current[1]();
      rerender({ ...props, focus: false });
      await wait(0);
    });
    expect(result.current[0]).toHaveLength(0);
  });
});

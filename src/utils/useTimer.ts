/* istanbul ignore file */
/**
 * Ignoring this file for testing because it's only used for storybook and testing this in the CI is a big issue
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = (
  interval: number,
  isRunning = true,
  initialDelta: number = 0
): { timer: number; isRunning: boolean; pause: () => void; play: () => void; reset: () => void } => {
  const isMounted = useRef(true);
  const [state, setState] = useState({ delta: initialDelta, time: Date.now(), isRunning });
  const pause = useCallback(() => setState(prevState => ({ ...prevState, isRunning: false })), []);
  const play = useCallback(() => setState(prevState => ({ ...prevState, isRunning: true, time: Date.now() })), []);
  const reset = useCallback(() => setState(prevState => ({ ...prevState, delta: 0, time: Date.now() })), []);
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );
  useEffect(() => {
    if (!state.isRunning) return;
    const timeout = setTimeout(() => {
      const time = Date.now();
      if (isMounted) setState(prevState => ({ ...prevState, time, delta: prevState.delta + (time - prevState.time) }));
    }, interval);
    return () => clearTimeout(timeout);
  }, [state.time, state.isRunning]); // eslint-disable-line react-hooks/exhaustive-deps
  return { timer: state.delta, isRunning: state.isRunning, play, pause, reset };
};

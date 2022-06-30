import { useRef, useEffect } from 'react';

export const usePrevious = <T = any>(value: T) => {
  const ref = useRef<any>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current as T;
};

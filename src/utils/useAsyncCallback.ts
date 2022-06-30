import { useState, useCallback, useRef, useEffect, DependencyList } from 'react';

export type TIsLoading = boolean;
export type TCallback<TResponse> = (...args: any[]) => Promise<TResponse>;

export const useAsyncCallback = <TResponse, TError = any>(
  callback: TCallback<TResponse>,
  deps: DependencyList,
  throwOnRejection: boolean = false
): [TCallback<TResponse>, TIsLoading, TError, TResponse] => {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);
  const [isLoading, setIsLoading] = useState<boolean>(undefined);
  const [error, setError] = useState<TError>(undefined);
  const [response, setResponse] = useState<TResponse>(undefined);
  const runAsync: TCallback<TResponse> = useCallback(
    async (...args: any[]) => {
      try {
        setIsLoading(true);
        const newResponse = await callback(...args);
        if (isMounted.current) {
          setResponse(newResponse);
          setIsLoading(false);
          setError(undefined);
        }
        return newResponse;
      } catch (e) {
        if (isMounted.current) {
          setResponse(undefined);
          setError(e as TError);
          setIsLoading(false);
          if (throwOnRejection) throw e;
        }
      }
    },
    [setIsLoading, setError, setResponse, ...deps] // eslint-disable-line react-hooks/exhaustive-deps
  );
  return [runAsync, isLoading, error, response];
};

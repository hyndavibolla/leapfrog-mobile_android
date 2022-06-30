import { useMemo, useCallback } from 'react';

export const useTestingHelper = (componentId: string) => {
  const getTestIdProps = useCallback(
    (id: string) => {
      const testId = `${componentId}-${id}`;
      return { testID: testId, accessibilityLabel: testId, accessible: true };
    },
    [componentId]
  );
  return useMemo(() => ({ getTestIdProps }), [getTestIdProps]);
};

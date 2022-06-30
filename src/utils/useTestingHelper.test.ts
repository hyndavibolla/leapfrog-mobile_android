import { renderHook } from '@testing-library/react-hooks';

import { useTestingHelper } from './useTestingHelper';

describe('useTestingHelper', () => {
  it('should get test id props', () => {
    const wrapper = renderHook(() => useTestingHelper('component'));
    expect(wrapper.result.current.getTestIdProps('label')).toEqual({ testID: 'component-label', accessibilityLabel: 'component-label', accessible: true });
  });
});

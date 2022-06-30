import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-native';

import { useAvatarUrl } from './useAvatarUrl';

describe('useAvatarUrl', () => {
  const testUrl = 'https://test.test/test.jpg';
  const avatarFallback = require('../assets/shared/avatarFallbackInverted.png');

  it('should return avatar', () => {
    const wrapper = renderHook(() => useAvatarUrl(avatarFallback));
    expect(wrapper.result.current[0]).toMatchObject(avatarFallback);
  });

  it('should return avatar from url', () => {
    const wrapper = renderHook(() => useAvatarUrl(testUrl));
    expect(wrapper.result.current[0]).toMatchObject({ uri: testUrl });
  });

  it('should return avatar after error', () => {
    const wrapper = renderHook(() => useAvatarUrl(testUrl));
    expect(wrapper.result.current[0]).toMatchObject({ uri: testUrl });
    act(() => wrapper.result.current[1]());
    expect(wrapper.result.current[0]).toMatchObject(avatarFallback);
  });
});

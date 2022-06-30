import { useCallback, useEffect, useState, useMemo } from 'react';

export const useAvatarUrl = (avatarUrl: string | number): [{ uri: string } | number, () => void] => {
  const [error, setError] = useState(false);
  const onAvatarError = useCallback(() => setError(true), []);
  useEffect(() => {
    setError(false);
  }, [avatarUrl]);

  const avatar = useMemo(() => (typeof avatarUrl === 'string' ? { uri: avatarUrl } : avatarUrl), [avatarUrl]);
  return [!error ? avatar : require('../assets/shared/avatarFallbackInverted.png'), onAvatarError];
};

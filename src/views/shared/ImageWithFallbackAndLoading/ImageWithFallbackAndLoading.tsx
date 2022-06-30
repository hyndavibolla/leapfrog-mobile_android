import React, { memo, ReactElement, useCallback, useState, useContext } from 'react';
import { View } from 'react-native';
import Image, { FastImageProps } from 'react-native-fast-image';

import { useDebounce } from '../../../utils/useDebounce';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { ENV } from '../../../constants';
import { GlobalContext } from '../../../state-mgmt/GlobalState';

export interface Props extends FastImageProps {
  customFallback: ReactElement;
  loading?: ReactElement;
}

export const ImageWithFallbackAndLoading = ({ customFallback, loading, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('image-with-fallback');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedLoading = useDebounce(isLoading, ENV.IMAGE_LOADING_FLICKERING_DEBOUNCE_MS); // avoids flickering when image was cached
  const setLoadingStart = useCallback(() => setIsLoading(true), []);
  const setLoadingEnd = useCallback(() => setIsLoading(false), []);

  const {
    deps: { logger }
  } = useContext(GlobalContext);

  const onError = useCallback(
    newError => {
      setError(newError);
      logger.error('Error trying to load image', { props, error: newError?.nativeEvent?.error });
    },
    [logger, props]
  );

  if (error) return customFallback;

  return (
    <>
      {!debouncedLoading ? null : <View {...getTestIdProps('loading')}>{loading}</View>}
      <Image
        onLoadStart={setLoadingStart}
        onLoadEnd={setLoadingEnd}
        {...(props as any)}
        source={props.source}
        style={debouncedLoading ? { width: 0, height: 0 } : props.style}
        onError={onError}
        {...getTestIdProps('container')}
      />
    </>
  );
};

export default memo(ImageWithFallbackAndLoading);

import React, { memo, useCallback, useMemo, useState } from 'react';
import { ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
import Image, { FastImageProps } from 'react-native-fast-image';

import { useDebounce } from '../../../utils/useDebounce';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { ENV } from '../../../constants';

export interface Props extends FastImageProps {
  fallbackSource: ImageSourcePropType;
  fallbackStyle?: StyleProp<ImageStyle>;
}

export const ImageWithFallback = ({ fallbackSource, fallbackStyle, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('image-with-fallback');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const source = useMemo(() => (error || !props.source ? fallbackSource : props.source), [error, props.source, fallbackSource]);
  const style = useMemo(() => [props.style, (error || !props.source) && fallbackStyle], [error, props.style, props.source, fallbackStyle]);
  const debouncedLoading = useDebounce(loading, ENV.IMAGE_LOADING_FLICKERING_DEBOUNCE_MS); // avoids flickering when image was cached
  const setLoadingStart = useCallback(() => setLoading(true), []);
  const setLoadingEnd = useCallback(() => setLoading(false), []);

  return (
    <>
      {!debouncedLoading ? null : <Image {...(props as any)} source={fallbackSource} style={fallbackStyle} {...getTestIdProps('loading')} />}
      <Image
        onLoadStart={setLoadingStart}
        onLoadEnd={setLoadingEnd}
        {...(props as any)}
        source={source}
        style={debouncedLoading ? { width: 0, height: 0 } : style}
        onError={setError}
        {...getTestIdProps('container')}
      />
    </>
  );
};

export default memo(ImageWithFallback);

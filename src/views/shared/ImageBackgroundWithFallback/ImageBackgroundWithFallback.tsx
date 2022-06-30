import React, { memo, useCallback, useState } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { Source } from 'react-native-fast-image';

import { ImageBackground, Props as ImageBackgroundProps } from '_components/ImageBackground';

import { ENV } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useDebounce } from '_utils/useDebounce';

interface Props extends ImageBackgroundProps {
  fallbackSource: Source;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ImageBackgroundWithFallback = ({ fallbackSource, containerStyle, source, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('image-background-with-fallback');
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const debouncedLoading = useDebounce(loading, ENV.IMAGE_LOADING_FLICKERING_DEBOUNCE_MS); // avoids flickering when image was cached

  const setLoadingStart = useCallback(() => setLoading(true), []);
  const setLoadingEnd = useCallback(() => setLoading(false), []);
  const onErrorHandle = useCallback(() => setError(true), []);

  return (
    <>
      {debouncedLoading && <ImageBackground {...props} source={fallbackSource} {...getTestIdProps('loading')} />}
      <ImageBackground
        {...props}
        onLoadStart={setLoadingStart}
        onLoadEnd={setLoadingEnd}
        source={error ? fallbackSource : source}
        containerStyle={debouncedLoading ? { width: 0, height: 0 } : containerStyle}
        onError={onErrorHandle}
        {...getTestIdProps('container')}
      />
    </>
  );
};

export default memo(ImageBackgroundWithFallback);

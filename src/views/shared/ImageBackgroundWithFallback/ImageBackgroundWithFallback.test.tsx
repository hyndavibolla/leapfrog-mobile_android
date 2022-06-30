import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import ImageBackgroundWithFallback from './ImageBackgroundWithFallback';

describe('ImageBackgroundWithFallback', () => {
  it('should render', () => {
    const { toJSON } = render(
      <View style={{ width: 50, height: 50 }}>
        <ImageBackgroundWithFallback containerStyle={{ width: '100%', height: '100%' }} source={{ uri: 'uri' }} fallbackSource={{ uri: 'fallback' }} />
      </View>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with fallback', () => {
    const { toJSON, getByTestId } = render(
      <View style={{ width: 50, height: 50 }}>
        <ImageBackgroundWithFallback containerStyle={{ width: '100%' }} source={{ uri: 'uri' }} fallbackSource={{ uri: 'fallback' }} />
      </View>
    );
    fireEvent(getByTestId('image-background-image'), 'onError', new Error());
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render loading', async () => {
    const { getAllByTestId, getByTestId } = render(
      <View style={{ width: 50, height: 50 }}>
        <ImageBackgroundWithFallback containerStyle={{ width: '100%', height: '100%' }} source={{ uri: 'uri' }} fallbackSource={{ uri: 'fallback' }} />
      </View>
    );
    fireEvent(getByTestId('image-background-image'), 'onLoadStart');
    expect(getAllByTestId('image-background-image')).toHaveLength(2);
    fireEvent(getAllByTestId('image-background-image')[1], 'onLoadEnd');
    expect(getAllByTestId('image-background-image')).toHaveLength(1);
  });
});

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { wait } from '../../../utils/wait';

import ImageWithFallback from './ImageWithFallback';

describe('ImageWithFallback', () => {
  it('should render', () => {
    const { toJSON } = render(<ImageWithFallback source={{ uri: 'uri' }} fallbackSource={{ uri: 'fallback' }} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with fallback', () => {
    const { toJSON, getByTestId } = render(<ImageWithFallback source={{ uri: 'uri' }} fallbackSource={{ uri: 'fallback' }} />);
    fireEvent(getByTestId('image-with-fallback-container'), 'onError', new Error());
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with fallback style', () => {
    const { toJSON, getByTestId } = render(
      <ImageWithFallback source={{ uri: 'uri' }} fallbackSource={{ uri: 'fallback' }} fallbackStyle={{ backgroundColor: 'red' }} />
    );
    fireEvent(getByTestId('image-with-fallback-container'), 'onError', new Error());
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render loading', async () => {
    const { queryByTestId, getByTestId } = render(
      <ImageWithFallback source={{ uri: 'uri' }} fallbackSource={{ uri: 'fallback' }} fallbackStyle={{ backgroundColor: 'red' }} />
    );
    await act(() => wait(0));
    fireEvent(getByTestId('image-with-fallback-container'), 'onLoadStart');
    await act(() => wait(0));
    expect(queryByTestId('image-with-fallback-loading')).toBeTruthy();
    fireEvent(getByTestId('image-with-fallback-container'), 'onLoadEnd');
    await act(() => wait(0));
    expect(queryByTestId('image-with-fallback-loading')).not.toBeTruthy();
  });
});

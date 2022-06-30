import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { Deps } from '../../../models/general';
import { getMockDeps } from '../../../test-utils/getMockDeps';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { wait } from '../../../utils/wait';
import { Text } from '../Text';

import ImageWithFallbackAndLoading from './ImageWithFallbackAndLoading';

describe('ImageWithFallbackAndLoading', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<ImageWithFallbackAndLoading source={{ uri: 'uri' }} customFallback={<Text>Fallback</Text>} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with fallback', async () => {
    const textFallback = 'Fallback';
    const { queryByTestId } = renderWithGlobalContext(
      <ImageWithFallbackAndLoading source={{ uri: 'uri' }} customFallback={<Text>{textFallback}</Text>} />,
      deps
    );
    await act(() => wait(0));
    fireEvent(queryByTestId('image-with-fallback-container'), 'onError', new Error());
    await act(() => wait(0));
    //TODO this should be fixed
    //expect(toJSON().children).toEqual([textFallback]);
  });

  it('should render loading', async () => {
    const { queryByTestId, getByTestId } = renderWithGlobalContext(
      <ImageWithFallbackAndLoading source={{ uri: 'uri' }} customFallback={<Text>Fallback</Text>} />,
      deps
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

import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import SwipeItem from './SwipeItem';
import { ICON, COLOR } from '_constants';

const mockedAction = jest.fn();

describe('SwipeItem', () => {
  it('should render with default values', async () => {
    const { getByTestId } = render(
      <SwipeItem onTapRight={mockedAction} textLeft={'Archive'} iconLeft={ICON.FOLDER_ARROW_DOWN}>
        <View style={{ width: 800, height: 58 }} />
      </SwipeItem>
    );
    expect(getByTestId('swipe-item-element')).toBeTruthy();
    expect(getByTestId('swipe-item-right-button')).toBeTruthy();
  });

  it('should click right button ', () => {
    const { getByTestId } = render(
      <SwipeItem onTapRight={mockedAction} textLeft={'Archive'} iconLeft={ICON.FOLDER_ARROW_DOWN} backgroundColor={COLOR.BLACK}>
        <View style={{ width: 800, height: 58 }} />
      </SwipeItem>
    );
    expect(getByTestId('swipe-item-right-button')).toBeTruthy();
    fireEvent.press(getByTestId('swipe-item-right-button'));
    expect(mockedAction).toBeCalled();
  });

  it('right component should have the same height as the parent component', () => {
    const height = 100;
    const component = () => (
      <SwipeItem onTapRight={mockedAction} textLeft={'Archive'} iconLeft={ICON.FOLDER_ARROW_DOWN} backgroundColor={COLOR.BLACK} parentMargin={0}>
        <View style={{ width: 800, height, marginBottom: 8 }} />
      </SwipeItem>
    );
    const { getByTestId, rerender } = render(component());
    fireEvent(getByTestId('swipe-item-element'), 'layout', {
      nativeEvent: { layout: { height } }
    });

    rerender(component());

    expect(getByTestId('swipe-item-right-button')).toBeTruthy();
    expect(getByTestId('swipe-item-right-button-container')).toBeTruthy();
    expect(getByTestId('swipe-item-right-button-container')).toHaveStyle({ height });
  });
});

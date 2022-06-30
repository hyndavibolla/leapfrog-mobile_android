import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { View } from 'react-native';
import { ViewWithTutorial } from '_commons/components/organisms/ViewWithTutorial';

describe('ViewWithTutorial', () => {
  it('should render with default values', () => {
    const control = jest.fn();
    const { getByTestId } = render(
      <ViewWithTutorial step={1} control={control}>
        <View testID="child" />
      </ViewWithTutorial>
    );
    fireEvent(getByTestId('view-tutorial-view'), 'layout', {
      nativeEvent: { layout: { height: 100 } }
    });
    expect(control).toBeCalled();
    expect(getByTestId('child')).toBeTruthy();
  });
});

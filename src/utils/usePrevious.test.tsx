import React, { useState } from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import { usePrevious } from './usePrevious';

describe('usePrevious', () => {
  it('should use previous value', () => {
    const Compo = () => {
      const [count, setCount] = useState(0);
      const prevCount = usePrevious(count);
      return (
        <View>
          <Text testID="count">{count}</Text>
          <Text testID="prev-count">{prevCount}</Text>
          <TouchableWithoutFeedback testID="add" onPress={() => setCount(count + 1)}>
            <Text>btn</Text>
          </TouchableWithoutFeedback>
        </View>
      );
    };
    const { getByTestId } = render(<Compo />);
    expect(getByTestId('prev-count').props.children).toEqual(undefined);
    expect(getByTestId('count').props.children).toEqual(0);
    fireEvent.press(getByTestId('add'));
    expect(getByTestId('prev-count').props.children).toEqual(0);
    expect(getByTestId('count').props.children).toEqual(1);
    fireEvent.press(getByTestId('add'));
    expect(getByTestId('prev-count').props.children).toEqual(1);
    expect(getByTestId('count').props.children).toEqual(2);
  });
});

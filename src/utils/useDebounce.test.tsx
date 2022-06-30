import React, { useState } from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

const { useDebounce } = jest.requireActual('./useDebounce');
import { wait } from './wait';

describe('useDebounce', () => {
  it('should use the debounced value', async () => {
    const debounceTime = 300;
    const Compo = () => {
      const [count, setCount] = useState(0);
      const debouncedCount = useDebounce(count, debounceTime);
      return (
        <View>
          <Text testID="count">{count}</Text>
          <Text testID="debounced-count">{debouncedCount}</Text>
          <TouchableWithoutFeedback testID="add" onPress={() => setCount(count + 1)}>
            <Text>btn</Text>
          </TouchableWithoutFeedback>
        </View>
      );
    };
    const { getByTestId } = render(<Compo />);
    await act(async () => {
      expect(getByTestId('debounced-count').props.children).toEqual(0);
      expect(getByTestId('count').props.children).toEqual(0);
      fireEvent.press(getByTestId('add'));
      await wait(debounceTime / 2);
      expect(getByTestId('debounced-count').props.children).toEqual(0);
      expect(getByTestId('count').props.children).toEqual(1);
      await wait(debounceTime);
      expect(getByTestId('debounced-count').props.children).toEqual(1);
      expect(getByTestId('count').props.children).toEqual(1);
    });
  });
});

import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { render } from '@testing-library/react-native';

import Carrousel from './Carrousel';

const testID = 'carrousel-flat-list';
const data = [].fill('Data', 5).map((item, index) => `${item} ${index}`);
const flatListComponent = (
  <FlatList
    testID={testID}
    data={data}
    renderItem={item => (
      <View>
        <Text>{item}</Text>
      </View>
    )}
  />
);

describe('Carrousel', () => {
  it('should render a Carrousel', () => {
    const { toJSON, queryAllByTestId } = render(<Carrousel children={flatListComponent} separatorWidth={10} itemWidth={90} />);
    expect(toJSON()).toMatchSnapshot();
    expect(queryAllByTestId(testID)).toBeTruthy();
  });
});

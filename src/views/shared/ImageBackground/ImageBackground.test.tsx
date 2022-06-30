import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';

import ImageBackground from './ImageBackground';

describe('ImageBackground', () => {
  it('should render', () => {
    const { toJSON } = render(
      <View style={{ width: 50 }}>
        <ImageBackground containerStyle={{ width: '100%' }} source={{ uri: 'uri' }} />
      </View>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

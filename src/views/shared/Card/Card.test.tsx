import React from 'react';
import { render } from '@testing-library/react-native';

import Card from './Card';
import { Text } from '../Text';

describe('Card', () => {
  it('should render', () => {
    const { toJSON } = render(
      <Card>
        <Text>Test text</Text>
      </Card>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should with custom styles', () => {
    const { toJSON } = render(
      <Card style={{ backgroundColor: 'red' }}>
        <Text>Test text</Text>
      </Card>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

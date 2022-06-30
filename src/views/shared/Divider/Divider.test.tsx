import React from 'react';
import { render } from '@testing-library/react-native';

import Divider from './Divider';

describe('Divider', () => {
  it('should render', () => {
    const { toJSON } = render(<Divider />);
    expect(toJSON()).toMatchSnapshot();
  });
});

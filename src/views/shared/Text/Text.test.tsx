import React from 'react';
import { render } from '@testing-library/react-native';

import Text from './Text';
import { FONT_FAMILY } from '../../../constants';

describe('Text', () => {
  it('should render with default font', () => {
    const { toJSON } = render(<Text>default font</Text>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with custom font', () => {
    const { toJSON } = render(<Text font={FONT_FAMILY.BOLD}>custom font</Text>);
    expect(toJSON()).toMatchSnapshot();
  });
});

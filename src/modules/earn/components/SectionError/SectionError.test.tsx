import React from 'react';
import { render } from '@testing-library/react-native';

import { SectionError } from '.';

describe('SectionError', () => {
  it('should render', async () => {
    const { toJSON } = render(<SectionError />);
    expect(toJSON()).toMatchSnapshot();
  });
});

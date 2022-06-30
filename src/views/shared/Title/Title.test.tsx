import React from 'react';
import { render } from '@testing-library/react-native';

import { Title, TitleType } from './Title';

describe('Title', () => {
  it('should render a header title', () => {
    const { toJSON } = render(<Title type={TitleType.HEADER}>Title</Title>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a section title', () => {
    const { toJSON } = render(<Title type={TitleType.SECTION}>Title</Title>);
    expect(toJSON()).toMatchSnapshot();
  });
});

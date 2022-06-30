import React from 'react';
import { render } from '@testing-library/react-native';

import EmptyState, { Props } from './EmptyState';

describe('EmptyState', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      visible: true,
      title: 'title',
      subtitleLine1: 'subtitle line 1',
      subtitleLine2: 'subtitle line 2'
    };
  });

  it('should render', () => {
    const { toJSON } = render(<EmptyState visible={true} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render nothing if the visible prop is the default value', () => {
    const { toJSON } = render(<EmptyState />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with props', () => {
    const { getByTestId, getByText } = render(<EmptyState {...props} />);
    const container = getByTestId('empty-state-simple');
    const titleLabel = getByText(props.title);
    expect(container).toBeTruthy();
    expect(titleLabel).toBeTruthy();
  });

  it('should render a EmptyState card', () => {
    const { getByTestId } = render(<EmptyState card visible />);
    const container = getByTestId('empty-state-card');
    expect(container).toBeTruthy();
  });

  it('should render nothing if visible has a false value', () => {
    const { toJSON } = render(<EmptyState {...props} card visible={false} />);
    expect(toJSON()).toBeFalsy();
  });
});

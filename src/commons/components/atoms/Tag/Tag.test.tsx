import React from 'react';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import Tag, { Props } from './Tag';

describe('Tag', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      children: 'Online Offer'
    };
  });

  it('should render with the assigned title', () => {
    const { getByTestId } = renderWithGlobalContext(<Tag {...props} />);
    expect(getByTestId('tag-title')).toHaveTextContent(props.children);
  });
});

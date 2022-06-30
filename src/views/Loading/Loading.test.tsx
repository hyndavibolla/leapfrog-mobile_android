import React from 'react';

import Loading, { Props } from './Loading';

import { renderWithGlobalContext } from '../../test-utils/renderWithGlobalContext';

describe('Loading', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
      size: 20
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<Loading {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

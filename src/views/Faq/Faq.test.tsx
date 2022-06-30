import React from 'react';

import Faq from './Faq';
import { renderWithGlobalContext } from '../../test-utils/renderWithGlobalContext';

describe('Faq', () => {
  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<Faq />);
    expect(toJSON()).toMatchSnapshot();
  });
});

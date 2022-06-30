import React from 'react';
import { render } from '@testing-library/react-native';

import BrandHeader, { Props } from './BrandHeader';
import { getMission_1 } from '../../../test-utils/entities';

describe('BrandHeader', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      uri: getMission_1().image
    };
  });

  it('should render', () => {
    const { toJSON } = render(<BrandHeader {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

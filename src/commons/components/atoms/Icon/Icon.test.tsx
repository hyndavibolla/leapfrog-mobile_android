import React from 'react';

import Icon, { Props } from './Icon';
import { Deps } from '_models/general';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { COLOR, FONT_SIZE, ICON } from '_constants';

describe('Icon', () => {
  let props: Props;
  let deps: Deps;

  beforeEach(() => {
    props = {
      name: ICON.ARROW_RIGHT
    };
  });

  it('should render Default Arrow Right Icon', () => {
    const { toJSON } = renderWithGlobalContext(<Icon {...props} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Arrow Right Icon with Custom Props', () => {
    const nonDefaultProps: Props = {
      ...props,
      color: COLOR.PURPLE,
      size: FONT_SIZE.EXTRA_TINY
    };
    const { toJSON } = renderWithGlobalContext(<Icon {...nonDefaultProps} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });
});

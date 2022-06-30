import React from 'react';

import ActivityDetailRow, { Props } from './ActivityDetailRow';

import { renderWithGlobalContext } from '../../../../test-utils/renderWithGlobalContext';
import { Icon } from '_commons/components/atoms/Icon';
import { ICON } from '_constants/icons';

describe('ActivityDetailRow', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      title: 'TOTAL ORDER',
      value: '$10',
      icon: <Icon name={ICON.REWARDS_GIFT_CARDS} />
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<ActivityDetailRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

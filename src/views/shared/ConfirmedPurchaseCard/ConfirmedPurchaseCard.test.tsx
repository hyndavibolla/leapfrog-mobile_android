import React from 'react';

import ConfirmedPurchaseCard, { Props } from './ConfirmedPurchaseCard';
import { getActivity_1 } from '../../../test-utils/entities';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

describe('ConfirmedPurchaseCard', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      activity: getActivity_1()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<ConfirmedPurchaseCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

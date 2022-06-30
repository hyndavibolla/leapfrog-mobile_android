import React from 'react';

import { getActivity_4 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import GiftCardPointRow, { Props } from './GiftCardPointRow';

describe('GiftCardPointRow', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      activity: getActivity_4()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<GiftCardPointRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without a requestor image', () => {
    props.activity.brandDetails.brandLogo = null;
    const { toJSON } = renderWithGlobalContext(<GiftCardPointRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without requestor name or offer name', () => {
    props.activity.requestorName = null;
    const { toJSON } = renderWithGlobalContext(<GiftCardPointRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render for gift card without date', async () => {
    props.activity.timestamp = null;
    const { toJSON } = renderWithGlobalContext(<GiftCardPointRow {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

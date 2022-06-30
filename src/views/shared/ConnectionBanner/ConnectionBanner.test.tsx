import React from 'react';

import ConnectionBanner, { Props } from './ConnectionBanner';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { getInitialState } from '../../../state-mgmt/GlobalState';
import { IGlobalState } from '../../../models/general';

describe('ConnectionBanner', () => {
  let props: Props;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    props = {
      title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
    };
  });

  it('should render with connection', () => {
    const { toJSON } = renderWithGlobalContext(<ConnectionBanner {...props} />, undefined, {
      ...initialState,
      core: { ...initialState.core, isConnected: true }
    });
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render WITHOUT connection', () => {
    const { toJSON } = renderWithGlobalContext(<ConnectionBanner {...props} />, undefined, {
      ...initialState,
      core: { ...initialState.core, isConnected: false }
    });
    expect(toJSON()).toMatchSnapshot();
  });
});

import React from 'react';
import { act } from 'react-test-renderer';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { EditProfile, Props } from './EditProfile';
import { wait } from '_utils/wait';

describe('EditProfile', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      route: { params: { uri: 'http://www.shopyourway.com' } }
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<EditProfile {...props} />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });
});

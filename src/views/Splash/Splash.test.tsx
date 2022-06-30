import React from 'react';
import { act } from 'react-test-renderer';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';
import { Splash } from './Splash';

describe('Splash', () => {
  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<Splash />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });
});

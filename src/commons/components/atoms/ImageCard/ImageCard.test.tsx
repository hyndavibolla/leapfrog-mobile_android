import React from 'react';
import { act } from 'react-test-renderer';

import { getMission_1 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { wait } from '_utils/wait';
import ImageCard, { Props } from './ImageCard';

describe('App Common WebView ', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      imageUrl: getMission_1().image
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<ImageCard {...props} />);
    await act(async () => await wait(0));
    expect(toJSON()).toMatchSnapshot();
  });
});

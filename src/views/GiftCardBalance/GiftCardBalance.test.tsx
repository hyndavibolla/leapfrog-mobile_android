import React from 'react';
import { act } from 'react-test-renderer';

import { Deps } from '_models/general';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';
import { GiftCardBalance, Props } from './GiftCardBalance';
import { wait } from '_utils/wait';

describe('GiftCard Balance', () => {
  let deps: Deps;
  let props: Props;

  beforeEach(() => {
    deps = getMockDeps();
    props = {
      route: { params: { url: 'https://example.com', cardNumber: 'LLC3 3GB9 FAR4 UHK', pin: '1894' } },
      navigation: { setOptions: jest.fn().mockImplementation(({ header }) => header()) } as any
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<GiftCardBalance {...props} />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });
});

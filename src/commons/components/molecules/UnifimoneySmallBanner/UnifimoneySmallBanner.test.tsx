import React from 'react';

import { UnifimoneySmallBanner } from '_commons/components/molecules/UnifimoneySmallBanner';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

describe('UnifimoneySmallBanner', () => {
  it('should render', () => {
    const { getByTestId, toJSON } = renderWithGlobalContext(<UnifimoneySmallBanner />);
    expect(getByTestId('unifimoney-small-banner-container')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});

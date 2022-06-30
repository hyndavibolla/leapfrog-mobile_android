import React from 'react';

import { UnifimoneyBanner } from '_commons/components/molecules/UnifimoneyBanner';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

describe('UnifimoneyBanner', () => {
  it('should render', () => {
    const { getByTestId, toJSON } = renderWithGlobalContext(<UnifimoneyBanner />);
    expect(getByTestId('unifimoney-banner-container')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});

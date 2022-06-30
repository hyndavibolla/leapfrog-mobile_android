import React from 'react';

import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { RouletteNumber } from '../RouletteNumber';

describe('Pill', () => {
  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<RouletteNumber>{10000}</RouletteNumber>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with large numbers', () => {
    const { toJSON } = renderWithGlobalContext(<RouletteNumber>{123456789}</RouletteNumber>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with invalid values', () => {
    const { toJSON } = renderWithGlobalContext(<RouletteNumber>{'10,000' as any}</RouletteNumber>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with over points', () => {
    const { toJSON } = renderWithGlobalContext(<RouletteNumber hideNumber={true}>{0}</RouletteNumber>);
    expect(toJSON()).toMatchSnapshot();
  });
});

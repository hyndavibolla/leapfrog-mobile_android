import React from 'react';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import { CardBrand, Props } from './CardBrand';

describe('Rewards Onboarding', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      brandLogo: 'https://s3.amazonaws.com/raise-content/ibi/GameStop-Logo.png',
      brandName: 'Burgers For Days',
      cardValue: '$100',
      faceplateUrl: 'https://s3.amazonaws.com/raise-content/ibi/GameStop-Logo.png'
    };
  });

  it('should render correctly', () => {
    const { getByTestId } = renderWithGlobalContext(<CardBrand {...props} />);
    expect(getByTestId('card-brand-container')).toBeTruthy();
  });

  it('should render faceplate instead the brand logo', () => {
    const { queryByTestId } = renderWithGlobalContext(<CardBrand {...props} />);
    expect(queryByTestId('brand-logo-image')).toBeNull();
  });

  it('should render brand logo instead faceplate', () => {
    props.faceplateUrl = null;
    const { getByTestId } = renderWithGlobalContext(<CardBrand {...props} />);
    expect(getByTestId('brand-logo-image')).toBeTruthy();
  });
});

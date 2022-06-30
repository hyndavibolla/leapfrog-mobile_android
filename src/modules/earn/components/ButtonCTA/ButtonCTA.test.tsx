import React from 'react';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { Theme } from '_commons/components/molecules/LargeContentCard';
import { ICON, COLOR } from '_constants';

import ButtonCTA, { Props } from './ButtonCTA';

describe('ButtonCTA', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      icon: ICON.ARROW_RIGHT,
      theme: Theme.DARK,
      title: "Let's go!"
    };
  });

  it('should render with dark theme', () => {
    const { getByTestId } = renderWithGlobalContext(<ButtonCTA {...props} />);
    expect(getByTestId('button-cta-container')).toHaveStyle({ backgroundColor: COLOR.PRIMARY_BLUE });
    expect(getByTestId('button-cta-title')).toHaveStyle({ color: COLOR.WHITE });
    expect(getByTestId('icon-text')).toHaveStyle({ color: COLOR.WHITE });
  });

  it('should render with light theme', () => {
    props.theme = Theme.LIGHT;
    const { getByTestId } = renderWithGlobalContext(<ButtonCTA {...props} />);
    expect(getByTestId('button-cta-container')).toHaveStyle({ backgroundColor: COLOR.WHITE });
    expect(getByTestId('button-cta-title')).toHaveStyle({ color: COLOR.PRIMARY_BLUE });
    expect(getByTestId('icon-text')).toHaveStyle({ color: COLOR.PRIMARY_BLUE });
  });
});

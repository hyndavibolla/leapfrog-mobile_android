import React from 'react';
import { render } from '@testing-library/react-native';

import { OnboardingTooltip, Props } from './OnboardingTooltip';

describe('OnboardingTooltip', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      title: 'Title',
      onPress: jest.fn(),
      isFlashy: false
    };
  });

  it('should render with title flashy', () => {
    const { toJSON } = render(<OnboardingTooltip {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without subtitle', () => {
    const { queryByTestId } = render(<OnboardingTooltip {...props} />);
    expect(queryByTestId('onboarding-tooltip-subtitle')).toBeFalsy();
  });

  it('should render with subtitle', () => {
    props.subtitle = 'Subtitle';

    const { getByTestId } = render(<OnboardingTooltip {...props} />);
    expect(getByTestId('onboarding-tooltip-subtitle')).toBeTruthy();
  });
});

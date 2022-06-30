import React from 'react';
import { render } from '@testing-library/react-native';

import { IStep } from '_commons/components/molecules/Onboarding';
import OnboardingStep, { Props } from '_commons/components/molecules/Onboarding/OnboardingStep';
import { COLOR } from '_constants';

const mockedGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockedGoBack })
}));

describe('Onboarding Step', () => {
  let props: Props;

  const step: IStep = {
    title: 'Title',
    animation: require('_assets/animations/rewards/1'),
    description: 'Description as string',
    backgroundColor: COLOR.PRIMARY_LIGHT_BLUE,
    sectionColor: COLOR.PRIMARY_LIGHT_BLUE,
    buttonLabel: 'Continue'
  };

  beforeEach(() => {
    props = {
      step: step,
      testId: 'string'
    };
  });

  it('should render without subtitle', async () => {
    const { toJSON, queryByTestId } = render(<OnboardingStep {...props} />);
    expect(toJSON()).toMatchSnapshot();
    expect(queryByTestId('onboarding-step-subtitle')).toBeFalsy();
  });

  it('should find subtitle when is passed', async () => {
    const newProps = { ...props, step: { ...props.step, subtitle: 'new' } };

    const { queryByTestId } = render(<OnboardingStep {...newProps} />);
    expect(queryByTestId('onboarding-step-subtitle')).toBeTruthy();
  });
});

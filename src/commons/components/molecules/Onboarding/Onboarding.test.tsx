import React from 'react';
import { Text } from 'react-native';
import { fireEvent, waitFor } from '@testing-library/react-native';

import Onboarding, { IStep, Props } from './Onboarding';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { COLOR } from '_constants';
import { getMockDeps } from '_test_utils/getMockDeps';

const steps: IStep[] = [
  {
    title: 'Title 1',
    description: 'Description 1',
    animation: require('_assets/animations/rewards/1'),
    backgroundColor: '#FFEDFB',
    sectionColor: COLOR.PRIMARY_BLUE,
    buttonLabel: 'Continue'
  },
  {
    title: 'Title 2',
    subtitle: 'Subtitle 2',
    description: 'Description2',
    animation: require('_assets/animations/rewards/1'),
    backgroundColor: '#DBE5F3',
    sectionColor: COLOR.PRIMARY_BLUE,
    buttonLabel: 'Continue'
  },
  {
    title: 'Title 3',
    subtitle: 'Subtitle 3',
    description: <Text>JSX Content</Text>,
    animation: require('_assets/animations/rewards/1'),
    backgroundColor: '#E8C9D4',
    sectionColor: COLOR.PINK,
    buttonLabel: 'Got it!'
  }
];

describe('Onboarding', () => {
  let props: Props;
  let width;

  beforeEach(() => {
    props = {
      steps,
      onNextPress: jest.fn(),
      onSkipPress: jest.fn(),
      onChangeStep: jest.fn()
    };

    width = getMockDeps().nativeHelperService.dimensions.getWindowWidth();
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<Onboarding {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should change steps', async () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<Onboarding {...props} />);

    expect(getByTestId('onboarding-step-0-active')).toBeTruthy();
    fireEvent.scroll(getByTestId('onboarding-scrollView'), {
      nativeEvent: {
        contentOffset: {
          x: width * 2
        }
      }
    });

    await waitFor(() => {
      expect(queryByTestId('onboarding-step-0-active')).toBeNull();
      expect(getByTestId('onboarding-step-2-active')).toBeTruthy();
      expect(props.onChangeStep).toBeCalledTimes(2);
    });
  });

  it('should change steps but do not run onChangeStep when the prop is not present', async () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<Onboarding steps={steps} onNextPress={jest.fn()} onSkipPress={jest.fn()} />);

    expect(getByTestId('onboarding-step-0-active')).toBeTruthy();
    fireEvent.scroll(getByTestId('onboarding-scrollView'), {
      nativeEvent: {
        contentOffset: {
          x: width * 2
        }
      }
    });

    await waitFor(() => {
      expect(queryByTestId('onboarding-step-0-active')).toBeNull();
      expect(getByTestId('onboarding-step-2-active')).toBeTruthy();
    });
  });

  it('should skip', () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<Onboarding {...props} />);

    expect(queryByTestId('onboarding-step-0-active')).toBeTruthy();
    fireEvent.press(getByTestId('onboarding-skip-btn'));
    expect(props.onSkipPress).toBeCalledTimes(1);
  });

  it('should complete the steps', async () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<Onboarding {...props} />);

    expect(getByTestId('onboarding-step-0-active')).toBeTruthy();
    fireEvent.scroll(getByTestId('onboarding-scrollView'), {
      nativeEvent: {
        contentOffset: {
          x: width * 1
        }
      }
    });
    fireEvent.press(getByTestId('onboarding-next-btn'));

    expect(queryByTestId('onboarding-step-0-active')).toBeNull();
    expect(getByTestId('onboarding-step-1-active')).toBeTruthy();
    expect(props.onNextPress).toBeCalledTimes(1);

    fireEvent.scroll(getByTestId('onboarding-scrollView'), {
      nativeEvent: {
        contentOffset: {
          x: width * 2
        }
      }
    });
    fireEvent.press(getByTestId('onboarding-next-btn'));

    expect(queryByTestId('onboarding-step-1-active')).toBeNull();
    expect(getByTestId('onboarding-step-2-active')).toBeTruthy();
    expect(props.onNextPress).toBeCalledTimes(2);
    expect(queryByTestId('onboarding-skip-btn')).toBeNull();
  });
});

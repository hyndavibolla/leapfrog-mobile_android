import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';

import RewardsOnboarding, { Props } from './RewardsOnboarding';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';

const mockedGoBack = jest.fn();

describe('Rewards Onboarding', () => {
  let props: Props;
  let width;

  beforeEach(() => {
    props = {
      navigation: { goBack: mockedGoBack } as any
    };

    width = getMockDeps().nativeHelperService.dimensions.getWindowWidth();
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<RewardsOnboarding {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should go back when next button was pressed', async () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<RewardsOnboarding {...props} />);

    expect(getByTestId('onboarding-step-0-active')).toBeTruthy();
    fireEvent.scroll(getByTestId('onboarding-scrollView'), {
      nativeEvent: {
        contentOffset: {
          x: 0
        }
      }
    });
    fireEvent.press(getByTestId('onboarding-next-btn'));

    expect(getByTestId('onboarding-step-0-active')).toBeTruthy();
    expect(mockedGoBack).not.toBeCalled();

    fireEvent.scroll(getByTestId('onboarding-scrollView'), {
      nativeEvent: {
        contentOffset: {
          x: width * 1
        }
      }
    });
    fireEvent.press(getByTestId('onboarding-next-btn'));

    await waitFor(() => {
      expect(queryByTestId('onboarding-step-0-active')).toBeNull();
      expect(getByTestId('onboarding-step-1-active')).toBeTruthy();
      expect(queryByTestId('onboarding-skip-btn')).toBeNull();
      expect(mockedGoBack).toBeCalledTimes(1);
    });
  });

  it('should go back when skip was pressed', async () => {
    const { getByTestId } = renderWithGlobalContext(<RewardsOnboarding {...props} />);

    fireEvent.press(getByTestId('onboarding-skip-btn'));
    await waitFor(() => {
      expect(mockedGoBack).toBeCalled();
    });
  });
});

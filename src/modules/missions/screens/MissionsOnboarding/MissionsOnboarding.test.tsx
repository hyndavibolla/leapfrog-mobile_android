import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { getMockDeps } from '_test_utils/getMockDeps';

import MissionsOnboarding, { Props } from './MissionsOnboarding';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

const mockedGoBack = jest.fn();

describe('Missions Onboarding', () => {
  let props: Props;
  let width;

  beforeEach(() => {
    props = {
      navigation: { goBack: mockedGoBack } as any
    };

    width = getMockDeps().nativeHelperService.dimensions.getWindowWidth();
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<MissionsOnboarding {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should go back when next button was pressed', async () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<MissionsOnboarding {...props} />);

    fireEvent.scroll(getByTestId('onboarding-scrollView'), {
      nativeEvent: {
        contentOffset: {
          x: 0
        }
      }
    });
    fireEvent.press(getByTestId('onboarding-next-btn'));

    expect(queryByTestId('onboarding-step-0-active')).toBeTruthy();
    expect(mockedGoBack).not.toBeCalled();

    fireEvent.scroll(getByTestId('onboarding-scrollView'), {
      nativeEvent: {
        contentOffset: {
          x: width * 2
        }
      }
    });
    fireEvent.press(getByTestId('onboarding-next-btn'));

    await waitFor(() => {
      expect(queryByTestId('onboarding-step-1-active')).toBeNull();
      expect(getByTestId('onboarding-step-2-active')).toBeTruthy();
      expect(queryByTestId('onboarding-skip-btn')).toBeNull();
      expect(mockedGoBack).toBeCalledTimes(1);
    });
  });

  it('should go back when skip was pressed', async () => {
    const { getByTestId } = renderWithGlobalContext(<MissionsOnboarding {...props} />);

    fireEvent.press(getByTestId('onboarding-skip-btn'));
    await waitFor(() => {
      expect(mockedGoBack).toBeCalled();
    });
  });
});

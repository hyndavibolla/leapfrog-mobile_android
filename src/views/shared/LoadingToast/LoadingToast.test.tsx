import React from 'react';
import { render } from '@testing-library/react-native';

import { ENV } from '../../../constants';
import LoadingToast from './LoadingToast';

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: jest.fn() })
}));

describe('LoadingToast', () => {
  it('should render', () => {
    const { toJSON } = render(<LoadingToast />);
    expect(toJSON()).toMatchSnapshot();
  });

  it.each([0, ENV.SPINNER_MESSAGE_CHANGE_MS, ENV.SPINNER_MESSAGE_CHANGE_MS * 2])('should render with timer %s from useTimer', time => {
    const { toJSON } = render(<LoadingToast initialTimer={time} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

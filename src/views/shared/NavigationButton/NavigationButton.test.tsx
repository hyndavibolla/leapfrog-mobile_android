import React from 'react';
import { render } from '@testing-library/react-native';

import NavigationButton, { NavigationButtonType } from './NavigationButton';

describe('NavigationButton', () => {
  let onPress: () => void;
  beforeEach(() => {
    onPress = jest.fn();
  });

  it('should render active', () => {
    const { toJSON } = render(<NavigationButton onPress={onPress} type={NavigationButtonType.EARN} active={true} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it.each([...Object.values(NavigationButtonType), 'invalid' as any])('should render the %o type', async type => {
    const { toJSON } = render(<NavigationButton onPress={onPress} type={type} active={false} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

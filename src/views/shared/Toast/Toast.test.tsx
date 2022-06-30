import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../Text';

import Toast, { ToastType } from './Toast';

describe('Toast', () => {
  it('should render a toast without children', () => {
    const { toJSON } = render(<Toast title="Toast Title" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a warning toast with string children', () => {
    const { toJSON } = render(
      <Toast title="Toast Title" type={ToastType.WARNING}>
        This is a string test
      </Toast>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without a title', () => {
    const { toJSON } = render(<Toast type={ToastType.SUCCESS}>Toast without a title</Toast>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without a close btn', () => {
    const { toJSON } = render(<Toast showCloseBtn={false}>Toast without a title</Toast>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a toast with component children', () => {
    const { toJSON } = render(
      <Toast type={ToastType.INFO} title="Toast Title" positionFromBottom={40}>
        <Text>This is a component</Text>
      </Toast>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

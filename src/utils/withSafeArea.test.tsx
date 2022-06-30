import React from 'react';
import { withSafeArea } from './withSafeArea';
import { render } from '@testing-library/react-native';

describe('withSafeArea', () => {
  it('should return  component wrapped in a SafeAreaView with header support', () => {
    const Component = withSafeArea(() => <div>this is the wrapped component's body</div>, true);
    const { toJSON } = render(<Component />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should return component wrapped in a SafeAreaView without header support', () => {
    const Component = withSafeArea(() => <div>this is the wrapped component's body</div>, false);
    const { getByTestId } = render(<Component />);
    expect(getByTestId('with-safe-area-statusbar-default')).toBeTruthy();
  });

  it('should return component wrapped without header and with statusbar blue', () => {
    const Component = withSafeArea(() => <div>this is the wrapped component's body</div>, false, { onlyBlueStatusBar: true });
    const { getByTestId } = render(<Component />);
    expect(getByTestId('with-safe-area-statusbar-blue')).toBeTruthy();
  });

  it('should return component wrapped in a SafeAreaView with custom edge', () => {
    const Component = withSafeArea(() => <div>this is the wrapped component's body</div>, false, { onlyBlueStatusBar: false }, ['left', 'right']);
    const { toJSON } = render(<Component />);
    expect(toJSON()).toMatchSnapshot();
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import SwitchNavBar, { Props, SwitchNavBarAlt } from './SwitchNavBar';

describe('SwitchNavBar', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      onPress: jest.fn(),
      activeKey: '1',
      optionList: [
        { key: '1', label: 'one' },
        { key: '2', label: 'two' }
      ]
    };
  });

  it('should render', () => {
    const { toJSON } = render(<SwitchNavBar {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with alt styles', () => {
    const { toJSON } = render(<SwitchNavBarAlt {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with alt styles invalid', () => {
    props.isInvalid = true;
    const { toJSON } = render(<SwitchNavBarAlt {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without a selected key', () => {
    props.activeKey = null;
    const { toJSON } = render(<SwitchNavBar {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable', () => {
    const { getByTestId } = render(<SwitchNavBar {...props} />);
    fireEvent.press(getByTestId('switch-nav-bar-btn-2'));
    expect(props.onPress).toBeCalledWith('2');
  });
});

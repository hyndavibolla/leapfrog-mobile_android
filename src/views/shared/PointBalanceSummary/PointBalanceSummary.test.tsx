import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import PointBalanceSummary, { Props } from './PointBalanceSummary';

describe('PointBalanceSummary', () => {
  let onPressTop: () => void;
  let onPressBottom: () => void;
  let props: Props;
  beforeEach(() => {
    onPressTop = jest.fn();
    onPressBottom = jest.fn();
    props = {
      onPressTop,
      onPressBottom,
      availablePoints: 37500,
      pendingPoints: 15320
    };
  });

  it('should render with defaults', () => {
    const { toJSON } = render(<PointBalanceSummary onPressTop={props.onPressTop} onPressBottom={props.onPressBottom} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable on the top button', () => {
    const { getByTestId } = render(
      <PointBalanceSummary
        onPressTop={props.onPressTop}
        onPressBottom={props.onPressBottom}
        availablePoints={props.availablePoints}
        pendingPoints={props.pendingPoints}
      />
    );
    fireEvent.press(getByTestId('point-balance-summary-top-btn'));
    expect(props.onPressTop).toBeCalled();
  });

  it('should be pressable on the bottom button', () => {
    const { getByTestId } = render(
      <PointBalanceSummary
        onPressTop={props.onPressTop}
        onPressBottom={props.onPressBottom}
        availablePoints={props.availablePoints}
        pendingPoints={props.pendingPoints}
      />
    );
    fireEvent.press(getByTestId('point-balance-summary-bottom-btn'));
    expect(props.onPressBottom).toBeCalled();
  });
});

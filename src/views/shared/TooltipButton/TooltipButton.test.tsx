import React from 'react';
import { render } from '@testing-library/react-native';

import TooltipButton from './TooltipButton';

describe('TooltipButton', () => {
  it('should render flashing', () => {
    const { toJSON } = render(<TooltipButton flashy={true} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render pressable', () => {
    const { toJSON } = render(<TooltipButton flashy={true} onPress={() => null} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render NOT flashing', () => {
    const { toJSON } = render(<TooltipButton flashy={false} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render NOT flashing ALT', () => {
    const { toJSON } = render(<TooltipButton flashy={false} altInactive={true} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

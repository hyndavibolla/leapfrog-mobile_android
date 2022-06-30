import React from 'react';
import { render } from '@testing-library/react-native';

import ProgressRing, { Props } from './ProgressRing';
import { COLOR } from '_constants';

describe('ProgressRing', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      progress: 30,
      label: '31,500',
      sublabel: 'OF 34,999'
    };
  });

  it('should render ', () => {
    const { toJSON } = render(<ProgressRing {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with specific width ', () => {
    const { toJSON } = render(<ProgressRing {...props} width={175} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with specific strokeWidth', () => {
    const { toJSON } = render(<ProgressRing {...props} strokeWidth={15} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with specific color', () => {
    const { toJSON } = render(<ProgressRing {...props} color={COLOR.PRIMARY_LIGHT_BLUE} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with zero progress', () => {
    const { toJSON } = render(<ProgressRing {...props} progress={0} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

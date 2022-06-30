import React from 'react';
import { render } from '@testing-library/react-native';

import { Text } from '_components/Text';
import { COLOR } from '_constants';
import Pill, { Props } from './Pill';

describe('Pill', () => {
  const pillContainerId = 'pill-container';
  const pillTextId = 'pill-text';
  let props: Props;
  beforeEach(() => {
    props = {};
  });

  it('should render', () => {
    const { getByTestId } = render(<Pill {...props}>10,000</Pill>);
    expect(getByTestId(pillContainerId)).toBeTruthy();
  });

  it('should render a pill with size S', () => {
    const { getByTestId } = render(<Pill size={'S'}>10</Pill>);
    expect(getByTestId(pillContainerId)).toHaveStyle({ height: 24 });
    expect(getByTestId(pillTextId)).toHaveStyle({ fontSize: 14 });
  });

  it('should render a pill with size M', () => {
    const { getByTestId } = render(<Pill size={'M'}>10</Pill>);
    expect(getByTestId(pillContainerId)).toHaveStyle({ height: 28 });
    expect(getByTestId(pillTextId)).toHaveStyle({ fontSize: 14 });
  });

  it('should render a disabled pill', () => {
    const { getByTestId } = render(
      <Pill {...props} isDisabled>
        10,000
      </Pill>
    );
    expect(getByTestId(pillContainerId)).toHaveStyle({ backgroundColor: COLOR.MEDIUM_GRAY });
    expect(getByTestId(pillTextId)).toHaveStyle({ color: COLOR.DARK_GRAY });
  });

  it('should render with component children', () => {
    const { getByTestId } = render(
      <Pill {...props}>
        <Text testID="text-element">10,000</Text>
      </Pill>
    );
    expect(getByTestId(pillTextId)).toContainElement(getByTestId('text-element'));
    expect(getByTestId(pillTextId)).toHaveTextContent('10,000');
  });

  it('should render with strikeThrough text', () => {
    const { getByTestId } = render(
      <Pill {...props} strikeThroughText="100">
        10,000
      </Pill>
    );
    const strikethrough = getByTestId('pill-strikethrough');
    expect(strikethrough).toBeTruthy();
    expect(strikethrough).toHaveTextContent('100');
    expect(getByTestId(pillTextId)).toContainElement(strikethrough);
    expect(getByTestId(pillTextId)).toHaveTextContent('100');
    expect(getByTestId(pillTextId)).toHaveTextContent('10,000');
  });

  it('should render with fallback text Mission', () => {
    const { getByTestId } = render(
      <Pill textFallback={'Mission'} {...props}>
        {null}
      </Pill>
    );
    const element = getByTestId('pill-text-fallback');
    expect(element.props.children).toBe('Mission');
  });

  it('should render with fallback text MAX offer', () => {
    const { getByTestId } = render(<Pill {...props}>{null}</Pill>);
    const element = getByTestId('pill-text-fallback');
    expect(element.props.children).toBe('MAX Offer');
  });

  it('should NOT render pill icon', () => {
    props.disableIcon = true;
    const { queryByTestId } = render(<Pill {...props}>1000</Pill>);
    expect(queryByTestId('pill-text-fallback')).toBeFalsy();
  });
});

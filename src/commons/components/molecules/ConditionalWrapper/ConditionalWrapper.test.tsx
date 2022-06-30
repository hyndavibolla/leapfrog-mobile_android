import React from 'react';
import { View, Text } from 'react-native';
import ConditionalWrapper, { Props } from './ConditionalWrapper';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

describe('ConditionalWrapper', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      condition: true,
      children: <Text testID="child">This is a children</Text>,
      wrapper: children => <View testID="wrapper">{children}</View>
    };
  });

  it('should render with wrapper', async () => {
    const { getByTestId } = renderWithGlobalContext(<ConditionalWrapper {...props} />);
    expect(getByTestId('wrapper')).toBeTruthy();
    expect(getByTestId('child')).toBeTruthy();
  });

  it('should render without wrapper', async () => {
    props.condition = false;
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<ConditionalWrapper {...props} />);
    expect(queryByTestId('wrapper')).toBeNull();
    expect(getByTestId('child')).toBeTruthy();
  });
});

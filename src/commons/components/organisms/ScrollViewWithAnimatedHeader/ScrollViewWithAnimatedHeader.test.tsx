import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';

import ScrollViewWithAnimatedHeader from '_commons/components/organisms/ScrollViewWithAnimatedHeader/ScrollViewWithAnimatedHeader';

const mockedGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: jest.fn(), goBack: mockedGoBack })
}));
describe('ScrollViewWithAnimatedHeader', () => {
  it('should render with header element', () => {
    const { getByTestId } = render(<ScrollViewWithAnimatedHeader header={<View testID="header" />} />);
    expect(getByTestId('header')).toBeTruthy();
  });

  it('should render with floatingComponent value', () => {
    const { getByText } = render(<ScrollViewWithAnimatedHeader floatingComponent={<Text>test</Text>} />);
    expect(getByText('test')).toBeTruthy();
  });
});

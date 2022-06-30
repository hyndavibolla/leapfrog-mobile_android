import React from 'react';
import { Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

import { COLOR, FONT_SIZE } from '_constants/styles';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import ToggleContent, { Props } from './ToggleContent';

describe('ToggleContent', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      title: 'title',
      titleColor: COLOR.GREEN,
      titleSize: FONT_SIZE.SMALL,
      children: <Text>test</Text>
    };
  });

  it('should render with default styled title and visible content', () => {
    props.titleColor = undefined;
    props.titleSize = undefined;
    const { getByTestId, getByText } = renderWithGlobalContext(<ToggleContent {...props} />);
    const title = getByTestId('toggle-title');
    expect(title).toHaveTextContent(props.title);
    const fontSize = Number.parseInt(FONT_SIZE.MEDIUM, 10);
    expect(title).toHaveStyle({ color: COLOR.BLACK, fontSize });
    expect(getByText('test')).toBeTruthy();
  });

  it('should render with styled title and visible content', () => {
    const { getByTestId, getByText } = renderWithGlobalContext(<ToggleContent {...props} />);
    const title = getByTestId('toggle-title');
    expect(title).toHaveTextContent(props.title);
    const fontSize = Number.parseInt(props.titleSize.replace('px', ''), 10);
    expect(title).toHaveStyle({ color: props.titleColor, fontSize });
    expect(getByText('test')).toBeTruthy();
  });

  it('should hide content', () => {
    const { getByTestId, getByText, queryByText } = renderWithGlobalContext(<ToggleContent {...props} />);
    expect(getByText('test')).toBeTruthy();
    fireEvent.press(getByTestId('toggle-button'));
    expect(queryByText('test')).toBeNull();
  });

  it('should show content if hidden', () => {
    const { getByTestId, getByText, queryByText } = renderWithGlobalContext(<ToggleContent {...props} />);
    expect(getByText('test')).toBeTruthy();
    fireEvent.press(getByTestId('toggle-button'));
    expect(queryByText('test')).toBeNull();
    fireEvent.press(getByTestId('toggle-button'));
    expect(getByText('test')).toBeTruthy();
  });
});

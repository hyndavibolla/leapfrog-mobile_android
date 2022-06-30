import React from 'react';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants/styles';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import TextRoundAvatar, { Props } from './TextRoundAvatar';

describe('TextRoundAvatar', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      value: '1+'
    };
  });

  it('should render with default values', () => {
    const { getByTestId } = renderWithGlobalContext(<TextRoundAvatar {...props} />);
    expect(getByTestId('text-round-avatar-container')).toHaveStyle({ backgroundColor: COLOR.MEDIUM_GRAY, height: 36, width: 36 });
    expect(getByTestId('text-round-avatar-value')).toHaveTextContent(props.value);
    expect(getByTestId('text-round-avatar-value')).toHaveProp('color', COLOR.BLACK);
    expect(getByTestId('text-round-avatar-value')).toHaveProp('font', FONT_FAMILY.MEDIUM);
    expect(getByTestId('text-round-avatar-value')).toHaveProp('size', FONT_SIZE.REGULAR);
  });

  it('should render with props values', () => {
    props = {
      ...props,
      textSize: FONT_SIZE.SMALLER_2X,
      color: COLOR.PRIMARY_BLUE,
      font: FONT_FAMILY.SEMIBOLD,
      size: 48,
      backgroundColor: COLOR.PINK
    };
    const { getByTestId } = renderWithGlobalContext(<TextRoundAvatar {...props} />);
    expect(getByTestId('text-round-avatar-container')).toHaveStyle({ backgroundColor: props.backgroundColor, height: props.size, width: props.size });
    expect(getByTestId('text-round-avatar-value')).toHaveTextContent(props.value);
    expect(getByTestId('text-round-avatar-value')).toHaveProp('color', props.color);
    expect(getByTestId('text-round-avatar-value')).toHaveProp('font', props.font);
    expect(getByTestId('text-round-avatar-value')).toHaveProp('size', props.textSize);
  });
});

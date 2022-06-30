import styled from '@emotion/native';

import { FONT_FAMILY, COLOR, FONT_SIZE, LINE_HEIGHT } from '_constants';

import { Props } from './Text';

export const StyledText = styled.Text<Props>`
  font-family: ${({ font }: Props) => font || FONT_FAMILY.MEDIUM};
  color: ${({ color }: Props) => color || COLOR.DARK_GRAY};
  font-size: ${({ size }: Props) => size || FONT_SIZE.SMALLER};
  line-height: ${({ lineHeight }: Props) => lineHeight || LINE_HEIGHT.PARAGRAPH};
`;

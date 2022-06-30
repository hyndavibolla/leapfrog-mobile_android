import { memo } from 'react';
import styled from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants';

export interface Props {
  type: TitleType;
}

export enum TitleType {
  HUGE = 'huge',
  HEADER = 'titleHeader',
  MAIN_SECTION = 'mainSectionHeader',
  SECTION = 'sectionHeader',
  SMALL = 'small'
}

const fontSize = {
  [TitleType.HUGE]: FONT_SIZE.BIG,
  [TitleType.HEADER]: FONT_SIZE.REGULAR,
  [TitleType.MAIN_SECTION]: FONT_SIZE.SMALL,
  [TitleType.SECTION]: FONT_SIZE.SMALLER,
  [TitleType.SMALL]: FONT_SIZE.PETITE
};

const lineHeight = {
  [TitleType.HUGE]: LINE_HEIGHT.HUGE,
  [TitleType.HEADER]: LINE_HEIGHT.BIG,
  [TitleType.MAIN_SECTION]: LINE_HEIGHT.MEDIUM,
  [TitleType.SECTION]: LINE_HEIGHT.MEDIUM,
  [TitleType.SMALL]: LINE_HEIGHT.MEDIUM
};

export const Title = styled.Text<Props>`
  font-family: ${FONT_FAMILY.BOLD};
  font-size: ${({ type }: Props) => fontSize[type] || fontSize[TitleType.SECTION]};
  line-height: ${({ type }: Props) => lineHeight[type] || lineHeight[TitleType.SECTION]};
  color: ${COLOR.BLACK};
`;

export default memo(Title) as any; /** @todo fix props typings */

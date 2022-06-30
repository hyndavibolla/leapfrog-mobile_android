import { css } from '@emotion/native';

import { COLOR, FONT_SIZE, LINE_HEIGHT, MEASURE } from '_constants/styles';

export const styles = {
  container: css`
    flex: 1;
    flex-direction: row;
    align-items: center;
    padding-left: ${MEASURE.CARD_PADDING}px;
    padding-right: ${MEASURE.CARD_PADDING}px;
  `,
  textContainer: css`
    padding-left: 32px;
  `,
  text: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.PARAGRAPH};
  `
};

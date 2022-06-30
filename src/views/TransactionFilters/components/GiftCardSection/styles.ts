import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  note: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    margin-bottom: 16px;
  `,
  bubbles: css`
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    flex-direction: row;
    margin-horizontal: 0;
  `,
  specialBubbles: css`
    padding-horizontal: 24px;
  `,
  bubblesContainer: css`
    flex: 1;
    justify-content: space-around;
  `,
  bubble: css`
    margin-right: 16px;
  `,
  SpecialBubble: css`
    margin-right: 0;
  `,
  container: css`
    padding: 24px 8px 24px 24px;
  `
};

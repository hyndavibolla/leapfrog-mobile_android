import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants';

export const styles = {
  container: css`
    flex-direction: row;
  `,
  swipe: css`
    width: 100%;
    z-index: 1;
  `,
  shadowContainer: css`
    background-color: ${COLOR.DARK_GRAY};
    position: absolute;
    right: -16px;
    left: 0px
    width: 100%;
  `,
  containerOption: css`
    min-width: 80px;
    justify-content: center;
    padding-left: 16px;
    border-radius: 10px;
    align-items: center;
  `,
  optionText: css`
    color: ${COLOR.WHITE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.TINY};
    line-height: ${LINE_HEIGHT.REGULAR};
  `
};

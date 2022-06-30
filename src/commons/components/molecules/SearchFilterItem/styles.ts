import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants';

export const styles = {
  optionContainer: css`
    margin-bottom: 8px;
    padding: 16px;
    border-radius: 8px;
    border-width: 2px;
    background-color: ${COLOR.MEDIUM_GRAY};
    border-color: ${COLOR.MEDIUM_GRAY};
    flex-direction: row;
    justify-content: space-between;
  `,
  optionContainerSelected: css`
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  checkContainerBackground: css`
    height: 19px;
    width: 19px;
    border-radius: 20px;
    background-color: ${COLOR.WHITE};
    justify-content: center;
    align-items: center;
  `,
  option: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.BLACK};
    line-height: ${LINE_HEIGHT.PARAGRAPH};
  `,
  optionSelected: css`
    color: ${COLOR.WHITE};
  `
};

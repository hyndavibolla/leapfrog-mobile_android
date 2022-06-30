import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  containerSearchHistory: css`
    margin-top: 16px;
  `,
  titleSearchHistory: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    color: ${COLOR.BLACK};
    margin-bottom: 4px;
  `
};

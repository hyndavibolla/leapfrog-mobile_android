import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  title: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    margin-bottom: 16px;
    line-height: ${FONT_SIZE.BIG};
  `,
  lightDescriptionText: css`
    font-size: ${FONT_SIZE.TINY};
    line-height: ${FONT_SIZE.PETITE};
    color: ${COLOR.DARK_GRAY};
    margin-top: 16px;
    margin-bottom: 20px;
  `
};

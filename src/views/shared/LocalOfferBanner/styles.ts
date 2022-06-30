import { css } from '@emotion/native';

import { COLOR, FONT_SIZE, FONT_FAMILY } from '_constants';

export const styles = {
  title: css`
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALLER};
    text-align: left;
    margin-bottom: 16px;
  `,
  description: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.PETITE};
    margin-top: 16px;
  `,
  imageContainer: css`
    width: 100%;
  `
};

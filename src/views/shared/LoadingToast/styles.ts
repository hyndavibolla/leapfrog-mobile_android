import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    z-index: 1;
    margin: 0 20px;
    background-color: ${COLOR.TRANSPARENT};
  `,
  toast: css`
    padding: 8px 16px;
    background-color: ${COLOR.PRIMARY_BLUE};
    border-radius: 5px;
  `,
  title: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.WHITE};
  `,
  text: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.TINY};
    color: ${COLOR.WHITE};
  `
};
